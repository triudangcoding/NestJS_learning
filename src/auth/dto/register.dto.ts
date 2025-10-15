import { IsNotEmpty, IsString, Matches } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9]{9,15}$/, { message: "phoneNumber must be digits (9-15)" })
    phoneNumber: string;
    @IsNotEmpty()
    @IsString()
    password: string;
    @IsNotEmpty()
    @IsString({message: "confirmPassword is required"})
    confirmPassword: string;
}


export class RegisterResponseDto {
    @IsString({ message: "message must be a string" })
    message: string;
  
    user: {
      id: string;
      phoneNumber: string;
    };
  
    constructor(message: string, user: { id: string; phoneNumber: string }) {
      this.message = message;
      this.user = user;
    }
  }