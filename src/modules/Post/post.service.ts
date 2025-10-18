import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/Shared/services/prisma.service";
import { CreatePostDto } from "./DTO/create-post-dto";

@Injectable()
export class PostService {
    constructor(private readonly prisma: PrismaService) {}

    async createPost(body: CreatePostDto, userId: string) {
        return this.prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                userId: userId
            }
        });
    }

    async getPosts(userId: string) {
        return this.prisma.post.findMany({
            where: {
                userId: userId
            }
        });
    }
}