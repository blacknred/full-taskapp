import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_URL: Joi.string().required(),
        CACHE_URL: Joi.string().required(),
        QUEUE_URL: Joi.string().required(),
        SECRET: Joi.string().required(),
      }),
    }),
    UsersModule,
    TokensModule,
  ],
})
export class AppModule {}
