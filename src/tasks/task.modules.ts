import { Module } from "@nestjs/common";
import { TaskControllers } from "./task.controllers";
import { TaskServices } from "./task.services";

@Module({
  imports: [],
  controllers: [TaskControllers],
  providers: [TaskServices],
})
export class TaskModule {}
