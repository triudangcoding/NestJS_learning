import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../constants/auth-constant';
import { envConfig } from '../../configs/env.config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator';

@Injectable()
export class AuthenticatorGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const authTypeValue = this.reflector.getAllAndOverride<boolean>(AUTH_TYPE_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
          console.log('authTypeValue:', authTypeValue);   
        return true;
    }
}