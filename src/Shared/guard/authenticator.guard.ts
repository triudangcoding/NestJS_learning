import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { REQUEST_USER_KEY, AuthType } from '../constants/auth-constant';
import { envConfig } from '../../configs/env.config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator';
import { TokenService } from '../services/token.service';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class AuthenticatorGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private tokenService: TokenService,
        private prisma: PrismaService,
    ) { }
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authTypeValue = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        
        // Nếu không có auth requirement, cho phép truy cập
        if (!authTypeValue) {
            return true;
        }
        
        const { authtype, option } = authTypeValue;
        const request = context.switchToHttp().getRequest();
        
        console.log('Auth requirement:', { authtype, option });
        
        // Xử lý logic authentication dựa trên authtype
        if (Array.isArray(authtype)) {
            // Multiple auth types - luôn yêu cầu TẤT CẢ (bảo mật cao)
            const results = await Promise.all(
                authtype.map(authType => this.checkAuthType(authType, request))
            );
            
            // Tất cả phải thành công
            const allValid = results.every(result => result === true);
            if (!allValid) {
                throw new UnauthorizedException('Authentication failed - all auth types required');
            }
            return true;
        } else {
            // Single auth type
            const isValid = await this.checkAuthType(authtype, request);
            if (!isValid) {
                throw new UnauthorizedException('Authentication failed');
            }
            return true;
        }
    }
    
    private async checkAuthType(authType: string, request: any): Promise<boolean> {
        try {
            switch (authType) {
                case AuthType.BEARER:
                    return await this.checkBearerToken(request);
                case AuthType.API_KEY:
                    return await this.checkApiKey(request);
                case AuthType.NONE:
                    return true;
                default:
                    return false;
            }
        } catch (error) {
            console.error(`Auth check failed for ${authType}:`, error);
            return false;
        }
    }
    
    private async checkBearerToken(request: any): Promise<boolean> {
        // Lấy token từ Authorization header hoặc cookie
        let accessToken = request.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            const cookieHeader = request.headers.cookie;
            const tokenMatch = cookieHeader?.match(/accessToken=([^;]+)/);
            accessToken = tokenMatch ? tokenMatch[1] : null;
        }
        
        if (!accessToken) {
            return false;
        }
        
        try {
            const decodedToken = await this.tokenService.verifyAccessToken(accessToken);
            request[REQUEST_USER_KEY] = decodedToken;
            return true;
        } catch (error) {
            // Thử refresh token nếu access token hết hạn
            const refreshToken = this.extractRefreshToken(request);
            if (refreshToken) {
                try {
                    const newTokens = await this.refreshTokens(refreshToken);
                    const decoded = await this.tokenService.verifyAccessToken(newTokens.accessToken);
                    request[REQUEST_USER_KEY] = decoded;
                    return true;
                } catch (refreshError) {
                    return false;
                }
            }
            return false;
        }
    }
    
    private async checkApiKey(request: any): Promise<boolean> {
        const xApiKey = request.headers['x-api-key'];
        if (!xApiKey || xApiKey !== envConfig.API_SECRET_KEY) {
            return false;
        }
        return true;
    }
    
    private extractRefreshToken(request: any): string | null {
        const refreshTokenHeader = request.headers['x-refresh-token'];
        if (refreshTokenHeader) {
            return refreshTokenHeader;
        }
        
        const cookieHeader = request.headers.cookie;
        const refreshTokenMatch = cookieHeader?.match(/refreshToken=([^;]+)/);
        return refreshTokenMatch ? refreshTokenMatch[1] : null;
    }
    
    private async refreshTokens(refreshToken: string) {
        const decoded = await this.tokenService.verifyRefreshToken(refreshToken);
        
        const tokenRecord = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });

        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            throw new Error('Refresh token expired');
        }

        const newAccessToken = this.tokenService.signAccessToken({
            userId: decoded.userId,
        });

        const newRefreshToken = this.tokenService.signRefreshToken({
            userId: decoded.userId,
        });

        await this.prisma.refreshToken.update({
            where: { token: refreshToken },
            data: {
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
}