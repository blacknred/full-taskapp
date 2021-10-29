import { IsString, IsNumber, IsEnum, MinLength } from 'class-validator';
import { TaskPriority, TaskType } from '../interfaces/task.interface';

export class CreateTaskDto {
  @IsString({ message: 'Must be a string' })
  @MinLength(5, { message: 'Must include atleast 5 chars' })
  name: string;
  @IsString({ message: 'Must be a string' })
  description: string;
  @IsEnum(TaskType, {
    message: `Must be one of ${Object.values(TaskType)}`,
  })
  type: TaskType;
  @IsNumber({}, { message: 'Must be an integer' })
  userId: number;
  @IsEnum(TaskPriority, {
    message: `Must be one of ${Object.values(TaskPriority)}`,
  })
  priority: TaskPriority;
}
