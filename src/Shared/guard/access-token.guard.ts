import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { isNotFoundError } from '../types/helper';
import { REQUEST_USER_KEY } from '../constants/auth-constant';
@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) { }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        
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
            if (isNotFoundError(error)) {
                throw new UnauthorizedException('Unauthorized');
            }
            throw new UnauthorizedException('Unauthorized');
        }
    }
}