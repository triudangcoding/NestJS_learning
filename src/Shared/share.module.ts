// share.module.ts
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HashingService } from './services/hashing.service';
import { PrismaService } from './services/prisma.service';
import { TokenService } from './services/token.service';
import { AuthenticatorGuard } from './guard/authenticator.guard';
import { envConfig } from 'src/configs/env.config';

const SharedServices = [HashingService, PrismaService, TokenService, AuthenticatorGuard];

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: envConfig.ACCESS_TOKEN_SECRET,
      signOptions: {
        algorithm: 'HS256',
      },
    })
  ],
  providers: SharedServices,
  exports: [...SharedServices, JwtModule]
})
export class ShareModule {}
