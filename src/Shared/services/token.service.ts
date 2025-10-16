import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envConfig } from 'src/configs/env.config';
import { TokenPayload } from '../types/jwt.token';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: { userId: number }) {
    const accessExpiresIn = /^\d+$/.test(envConfig.ACCESS_TOKEN_EXPIRES_IN)
      ? Number(envConfig.ACCESS_TOKEN_EXPIRES_IN)
      : (envConfig.ACCESS_TOKEN_EXPIRES_IN as `${number}${'ms'|'s'|'m'|'h'|'d'}`);

    return this.jwtService.sign(payload, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      expiresIn: accessExpiresIn,
      algorithm: 'HS256',
    });
  }

  signRefreshToken(payload: { userId: number }) {
    const refreshExpiresIn = /^\d+$/.test(envConfig.REFRESH_TOKEN_EXPIRES_IN)
      ? Number(envConfig.REFRESH_TOKEN_EXPIRES_IN)
      : (envConfig.REFRESH_TOKEN_EXPIRES_IN as `${number}${'ms'|'s'|'m'|'h'|'d'}`);

    return this.jwtService.sign(payload, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      expiresIn: refreshExpiresIn,
      algorithm: 'HS256',
    });
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    });
  }

  verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    });
  }
}
