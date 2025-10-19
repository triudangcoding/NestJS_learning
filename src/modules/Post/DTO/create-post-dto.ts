import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    userId?: string; // Optional vì sẽ lấy từ token
}

export class UpdatePostDto extends CreatePostDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}