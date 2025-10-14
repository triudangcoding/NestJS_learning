import { Module } from "@nestjs/common";
import { HashingService } from "./hashing.service";
import { PrismaService } from "./prisma.service";

@Module({
  providers: [HashingService, PrismaService],
  exports: [HashingService, PrismaService]  
})
export class ShareModule {}