import { IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;
    @IsNotEmpty()
    @IsString()
    password: string;
    @IsNotEmpty()
    @IsString({message: "confirmPassword is required"})
    confirmPassword: string;
}

export class RegisterResponseDto extends RegisterDto {
    @IsString({ message: "name is required" })
    name: string;
}