import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { PrismaService } from '../services/prisma.service';
import { isNotFoundError } from '../types/helper';
import { REQUEST_USER_KEY } from '../constants/auth-constant';
@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly tokenService: TokenService,
        private readonly prisma: PrismaService,
    ) { }
    
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        
        // Lấy token từ Authorization header hoặc cookie accessToken
        let accessToken = request.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            const cookieHeader = request.headers.cookie;
            const tokenMatch = cookieHeader?.match(/accessToken=([^;]+)/);
            accessToken = tokenMatch ? tokenMatch[1] : null;
        }
        
        if (!accessToken) {
            throw new UnauthorizedException('Unauthorized');
        }
        
        try {
            const decodedToken = await this.tokenService.verifyAccessToken(accessToken);
            request[REQUEST_USER_KEY] = decodedToken;
            return true;
        } catch (error) {
            // Token hết hạn, thử refresh
            const refreshToken = this.extractRefreshToken(request);
            
            if (!refreshToken) {
                throw new UnauthorizedException('Unauthorized');
            }

            try {
                const newTokens = await this.refreshTokens(refreshToken);
                
                // Cập nhật request với access token mới
                request.headers.authorization = `Bearer ${newTokens.accessToken}`;
                
                // Lưu user info vào request
                const decoded = await this.tokenService.verifyAccessToken(newTokens.accessToken);
                request[REQUEST_USER_KEY] = decoded;
                
                // Gửi token mới về client
                response.setHeader('X-New-Access-Token', newTokens.accessToken);
                response.setHeader('X-New-Refresh-Token', newTokens.refreshToken);
                
                return true;
            } catch (refreshError) {
                if (isNotFoundError(error)) {
                    throw new UnauthorizedException('Unauthorized');
                }
                throw new UnauthorizedException('Unauthorized');
            }
        }
    }

    private extractRefreshToken(request: any): string | null {
        // Lấy refresh token từ header
        const refreshTokenHeader = request.headers['x-refresh-token'];
        if (refreshTokenHeader) {
            return refreshTokenHeader;
        }

        // Lấy từ cookie
        const cookieHeader = request.headers.cookie;
        const refreshTokenMatch = cookieHeader?.match(/refreshToken=([^;]+)/);
        return refreshTokenMatch ? refreshTokenMatch[1] : null;
    }

    private async refreshTokens(refreshToken: string) {
        // Verify refresh token
        const decoded = await this.tokenService.verifyRefreshToken(refreshToken);
        
        // Kiểm tra refresh token trong DB
        const tokenRecord = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });

        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            throw new Error('Refresh token expired');
        }

        // Tạo tokens mới
        const newAccessToken = this.tokenService.signAccessToken({
            userId: decoded.userId,
        });

        const newRefreshToken = this.tokenService.signRefreshToken({
            userId: decoded.userId,
        });

        // Cập nhật refresh token trong DB
        await this.prisma.refreshToken.update({
            where: { token: refreshToken },
            data: {
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
}