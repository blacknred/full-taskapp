import { IsNumber, IsOptional, IsString } from 'class-validator';
import { AccessDto } from 'src/__shared__/dto/request.dto';

export class CreateAgentDto extends AccessDto {
  @IsNumber({}, { message: 'Must be an integer' })
  userId: number;

  @IsString({ message: 'Must be a string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  image?: string;

  @IsOptional()
  @IsString({ message: 'Must be a string' })
  role?: string;
}
