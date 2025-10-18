import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../constants/auth-constant';
import { envConfig } from '../../configs/env.config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const xApiKey = request.headers['x-api-key'];
        if (!xApiKey || xApiKey !== envConfig.API_SECRET_KEY) {
            throw new UnauthorizedException('Invalid API key');
        }
        return true;
    }
}