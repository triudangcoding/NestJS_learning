import { ShareModule } from "src/Shared/share.module";
import { PostController } from "./post.controller"
import { PostService } from "./post.service"
import { Module } from "@nestjs/common";

@Module({
    imports: [ShareModule],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService]
})
export class PostModule {}