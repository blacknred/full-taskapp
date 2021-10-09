import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { ITask } from '../interfaces/task.interface';
import { taskMock } from './task-response.dto';

export class TasksResponseDto extends ResponseDto {
  @ApiProperty({ example: [taskMock], nullable: false })
  data: ITask[];
}
