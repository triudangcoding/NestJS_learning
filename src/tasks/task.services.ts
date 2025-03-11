import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { v4 } from "uuid";

export enum TaskStatus {
  OPEN = "open",
  IN_POSTGRESS = "in_postgress",
  DONE = "done",
}

export interface Itask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
@Injectable()
export class TaskServices {
  private tasks = [];
  getTask() {
    return this.tasks;
  }

  createTask(task: Itask) {
    const newTask = {
      ...task,
      status: TaskStatus.OPEN,
      id: v4()
    };
    this.tasks.push(newTask as never);
    return newTask;
  }
  deleteTaskbyId(taskId: string) {
    const foundTask = this.tasks.find((task: Itask) => task.id === taskId);
    if (!foundTask) {
      throw new NotFoundException(`Task With ID ${taskId} not found!`);
    }
    return foundTask;
  }

  updateTaskBtId(updateId: String, status: TaskStatus) {
    const foundTask = this.tasks.find((task: Itask) => task.id === updateId);
    if(!foundTask) {
      throw new NotFoundException(`Task with ID ${updateId} not found!`)
    }
    const taskToUpdate = foundTask as Itask;
    taskToUpdate.status = status;

    return taskToUpdate;
  }

  updateTask(udtask: Itask) {}

}
