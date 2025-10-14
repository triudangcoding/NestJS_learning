import { IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;
    @IsNotEmpty()
    @IsString()
    password: string;
}