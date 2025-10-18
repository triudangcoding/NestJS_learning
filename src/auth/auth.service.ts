import { HttpException, HttpStatus, Injectable, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { HashingService } from "../Shared/services/hashing.service";
import { PrismaService } from "../Shared/services/prisma.service";
import { LoginBodyDTO, RefreshTokenBodyDTO, RegisterBodyDTO } from "./dto/login-body.dto";
import { TokenService } from "src/Shared/services/token.service";
import { Prisma } from "@prisma/client";  
import { isNotFoundError, isUniqueConstraintError } from "src/Shared/types/helper";

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) { }

  async register(body: RegisterBodyDTO) {
    try {
      const existingUser = await this.prismaService.user.findFirst({
        where: { phoneNumber: body.phoneNumber  }
      });
  
      if (existingUser) {
        throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
      }
  
      const hashedPassword = await this.hashingService.hash(body.password);
  
      // Kiểm tra password và confirmPassword trước khi hash
      if (body.password !== body.confirmPassword) {
        throw new HttpException("Password and confirmPassword do not match", HttpStatus.BAD_REQUEST);
      }
  
      const user = await this.prismaService.user.create({
        data: {
          phoneNumber: body.phoneNumber,
          password: hashedPassword,
          fullName: body.name
        }
      });
  
      return {
        message: "User registered successfully",
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
        }
      };
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(body: LoginBodyDTO) {
    
    const user = await this.prismaService.user.findFirst({
      where: { phoneNumber: body.phoneNumber }
    });
    
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const isMatch = await this.hashingService.compare(body.password, user.password);
    if (!isMatch) {
      throw new UnprocessableEntityException([
        {
          property: "password",
          errors: ["Password is incorrect"]
        }
      ]);
    }

    const tokens = await this.generateTokens({ userId: user.id });
    return {
      user: {
        id: user.id,
        name: user.fullName,
        phoneNumber: user.phoneNumber
      },
    };
  }

 

  async generateTokens(payload: { userId: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload)
    ]);

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      }
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(body: RefreshTokenBodyDTO) {

    try {
      const {userId} = await this.tokenService.verifyRefreshToken(body.refreshToken);
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: body.refreshToken
        }
      })

      await this.prismaService.refreshToken.delete({
        where: {
          token: body.refreshToken
        }
      })

      return this.generateTokens({ userId });
    } catch (error) {
    if (isNotFoundError(error)) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    throw new UnauthorizedException('Invalid refresh token');
  }
  }
}

