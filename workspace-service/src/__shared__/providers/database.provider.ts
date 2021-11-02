import { ConfigModule, ConfigService } from '@nestjs/config';
import { createConnection } from 'typeorm';
import { Saga } from '../../sagas/entities/saga.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { DB_CONNECTION } from '../consts';

export const databaseProvider = {
  provide: DB_CONNECTION,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) =>
    createConnection({
      entities: [Workspace, Saga, Task],
      url: configService.get('DB_URL'),
      type: 'mongodb',
      logging: true,
      synchronize: true,
    }),
};