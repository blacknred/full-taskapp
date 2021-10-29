import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import {
  ResponseDto,
  TaskResponseDto,
  TasksResponseDto,
} from './dto/response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('create')
  create(@Payload() createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    return this.tasksService.create(createTaskDto);
  }

  @MessagePattern('getAll')
  getAll(@Payload() getTasksDto: GetTasksDto): Promise<TasksResponseDto> {
    return this.tasksService.findAll(getTasksDto);
  }

  @MessagePattern('getOne')
  getOne(@Payload() { id, userId }: GetTaskDto): Promise<TaskResponseDto> {
    return this.tasksService.findOne(id, userId);
  }

  @MessagePattern('patch')
  update(@Payload() updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto> {
    return this.tasksService.update(updateTaskDto.id, updateTaskDto);
  }

  @MessagePattern('delete')
  remove(@Payload() { id, userId }: GetTaskDto): Promise<ResponseDto> {
    return this.tasksService.remove(id, userId);
  }
}