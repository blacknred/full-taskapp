import { ApiProperty } from '@nestjs/swagger';

export class ValidationError {
  field: string;
  message: string;
}

export class Paginated<T> {
  hasMore: boolean;
  total: number;
  items: T[];
}

export class ResponseDto<T = unknown> {
  @ApiProperty({ example: null, required: false })
  data?: T;

  @ApiProperty({ type: Paginated, example: null, required: false })
  errors?: ValidationError[];
}

export class EmptyResponseDto extends ResponseDto<null> {
  @ApiProperty({ example: null, nullable: true, type: 'null' })
  data: null;
}

export class PaginatedResponseDto<T> extends ResponseDto<Paginated<T>> {}
