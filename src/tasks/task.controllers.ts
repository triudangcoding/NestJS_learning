import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TaskServices } from "./task.services";
import { get } from "http";

@Controller("tasks")
export class TaskControllers {
  constructor(private taskService: TaskServices) {}
  @Get()
  getTask() {
    return this.taskService.getTask();
  }

  @Post()
  createTask(@Body() data: any) {
    return this.taskService.createTask(data);
  }

  @Get("/:id")
  detailTask(): string {
    return "Get Item";
  }

  @Put("/:updateTaskId")
  updateTask(@Param("updateTaskId") updateTaskId: string, @Body() data: any) {
    console.log("this is DataLog: ",data);
    console.log("updateTaskId:" ,updateTaskId);
    
    return this.taskService.updateTask(data);
    
  }

  @Delete("/:taskId")
  deleteTaskbyId(@Param("taskId") taskId: string) {
    return this.taskService.deleteTaskbyId(taskId);
  }
}
