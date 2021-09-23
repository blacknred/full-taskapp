import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IResponse } from './shared/interfaces/response.interface';

@Injectable()
export class AppService {
  constructor(protected readonly service: ClientProxy) {}

  static use(service: ClientProxy) {
    return new AppService(service);
  }

  async feed<T>(pattern: string, args: unknown) {
    const { data, errors, status }: IResponse<T> = await firstValueFrom(
      this.service.send(pattern, args),
    );

    if (status !== HttpStatus.CREATED && status !== HttpStatus.OK) {
      throw new HttpException({ errors }, status);
    }

    return { data };
  }
}