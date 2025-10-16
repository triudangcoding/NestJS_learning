import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class LoginBodyDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9]{9,15}$/, { message: "phoneNumber must be digits (9-15)" })
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

    // Bắt buộc confirmPassword khi đăng ký
    @IsNotEmpty()
    @IsString()
    declare confirmPassword: string;
}

export class LoginResponseDto {
    message: string;
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