import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginBodyDTO, RegisterBodyDTO, LoginResponseDto, RefreshTokenBodyDTO } from "./dto/login-body.dto";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body);
  }

  @Post("login")
  async login(@Body() body: LoginBodyDTO) {
    return new LoginResponseDto( await this.authService.login(body));
  }

  @Post("refresh-token")
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    return this.authService.refreshToken(body);
  }
} 