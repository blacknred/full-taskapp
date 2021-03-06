import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/__shared__/dto/request.dto';
import { CreateAgentDto } from './create-agent.dto';

export class GetAgentsDto extends IntersectionType(
  PartialType(OmitType(CreateAgentDto, ['image'])),
  PaginationDto,
) {
  @ApiProperty({ example: new Date().toDateString(), required: false })
  createdAt?: string;
}
