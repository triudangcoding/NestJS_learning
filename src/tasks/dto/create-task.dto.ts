//DTO is Data Transfer Oject

import { IsNotEmpty, isNotEmpty, IsString, MaxLength } from "class-validator";


export class createTaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  title: string;
  @IsNotEmpty()
  @IsString()
  description: string;
}
    