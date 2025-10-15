import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HashingService } from "../Shared/hashing.service";
import { PrismaService } from "../Shared/prisma.service";
import { RegisterDto } from "./dto/register";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService, 
    private readonly prismaService: PrismaService
  ) {}

  async register(body: RegisterDto) {
    const existingUser = await this.prismaService.user.findFirst({
      where: { phoneNumber: body.phoneNumber }
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
      }
    });
    
    return {
      message: "User registered successfully",
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber
      }
    };
  }
  async login(body: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: { phoneNumber: body.phoneNumber }
    });
    if (!user) {
      throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
    }
    const isMatch = await this.hashingService.compare(body.password, user.password);
    if (!isMatch) {
      throw new HttpException("Password is incorrect", HttpStatus.BAD_REQUEST);
    }
    return {
      message: "Login successful",
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber
      }
    };
  }
}

