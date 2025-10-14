import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TaskModule } from "./tasks/task.modules";
import { TaskServices } from "src/tasks/task.services";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [TaskModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, TaskServices],
})
export class AppModule {}
