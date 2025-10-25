import { Body, Controller, Post, UseGuards, Req, Get } from "@nestjs/common";
import { ApiKeyGuard } from "src/Shared/guard/api-key.guard";
import { PostService } from "./post.service";
import { CreatePostDto, UpdatePostDto } from "./DTO/create-post-dto";
import { AccessTokenGuard } from "src/Shared/guard/access-token.guard";
import { AuthType, ConditionGuard, REQUEST_USER_KEY } from "src/Shared/constants/auth-constant";
import { Auth } from "src/Shared/decorators/auth.decorator";
import { AuthenticatorGuard } from "src/Shared/guard/authenticator.guard";

@Controller("post")
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post("create-post")
    @Auth([AuthType.BEARER, AuthType.API_KEY], ConditionGuard.AND)
    @UseGuards(AuthenticatorGuard)
    async createPost(@Body() body: CreatePostDto, @Req() request: any) {
        const userId = request[REQUEST_USER_KEY].userId;
        return this.postService.createPost(body, userId);
    }
    @Auth([AuthType.BEARER, AuthType.API_KEY], ConditionGuard.AND)
    @UseGuards(AuthenticatorGuard)
    @Get("get")
    async getPosts(@Req() request: any) {
        const userId = request[REQUEST_USER_KEY].userId;
        return this.postService.getPosts(userId);
    }
    @Post("update-post")
    @UseGuards(AccessTokenGuard, ApiKeyGuard)
    async updatePost(@Body() body: UpdatePostDto, @Req() request: any) {
        const userId = request[REQUEST_USER_KEY].userId;
        return this.postService.updatePost(body, userId);
    }
}