import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Matches } from "src/Shared/decorators/custom-validator.decorator";

export class LoginBodyDTO {
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    confirmPassword?: string;
}
  
  export class LoginResDTO {
    accessToken: string;
    refreshToken: string;
  
    constructor(partial: Partial<LoginResDTO>) {
      Object.assign(this, partial);
    }
  }
  
export class RegisterBodyDTO extends LoginBodyDTO {
    @IsString({ message: 'Tên phải là chuỗi' })
    name: string;
    @IsNotEmpty()
    @IsString()
    @Matches("password")
    declare confirmPassword: string;
}

export class LoginResponseDto {
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    user: {
        id: string;
        phoneNumber: string;
    };
    constructor(partial: Partial<LoginResponseDto>) {
        Object.assign(this, partial);
    }
}

export class RefreshTokenBodyDTO {
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}