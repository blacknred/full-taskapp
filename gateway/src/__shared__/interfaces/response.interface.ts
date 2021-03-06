import { HttpStatus } from '@nestjs/common';

export type ValidationError = {
  field: string;
  message: string;
};

export interface BaseResponse<T = unknown> {
  status?: HttpStatus;
  errors?: ValidationError[];
  data?: T;
  meta?: Record<string, unknown>;
  message?: string;
}
