import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/entities/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        QUEUE_URL: Joi.string().required(),
        DB_URL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        entities: [Task],
        url: configService.get('DB_URL').slice(0, 34),
        type: 'mongodb',
        logging: true,
        synchronize: true,
      }),
    }),
  ],
})
export class AppModule {}