import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginBodyDTO, RegisterBodyDTO, LoginResponseDto, RefreshTokenBodyDTO } from "./dto/login-body.dto";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginBodyDTO) {
    return new LoginResponseDto( await this.authService.login(body));
  }

  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    return this.authService.refreshToken(body);
  }
} 