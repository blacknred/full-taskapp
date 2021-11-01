import { ObjectID } from 'typeorm';
import { IAgent } from './agent.interface';
import { IRole } from './role.interface';

export interface IWorkspace {
  id: ObjectID;
  name: string;
  description?: string;
  creatorId: number;
  labels: string[];
  roles: IRole[];
  agents: IAgent[];
  createdAt: Date;
  updatedAt: Date;
}
