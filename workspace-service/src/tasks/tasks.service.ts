import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Agent } from 'src/agents/entities/agent.entity';
import { IAgent } from 'src/agents/interfaces/agent.interface';
import { BaseRole, Privilege } from 'src/roles/interfaces/role.interface';
import { Saga } from 'src/sagas/entities/saga.entity';
import { ResponseDto } from 'src/__shared__/dto/response.dto';
import { NOTIFICATION_SERVICE, WORKER_SERVICE } from './consts';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskUpdate, UpdateRecord } from './entities/task.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: ClientProxy,
    @Inject(WORKER_SERVICE) private readonly workerService: ClientProxy,
    @InjectRepository(Task) private taskRepository: EntityRepository<Task>,
    @InjectRepository(Agent) private agentRepository: EntityRepository<Agent>,
    @InjectRepository(Saga) private sagaRepository: EntityRepository<Saga>,
  ) {}

  async create(createTaskDto: CreateTaskDto, agent: Agent) {
    const { assigneeId, sagaIds, ...rest } = createTaskDto;
    try {
      const data = new Task(rest);
      data.wid = agent.wid;
      data.creator = agent;
      if (assigneeId) {
        data.assignee = await this.agentRepository.findOne(assigneeId);
      }
      if (sagaIds) {
        const sagas = await this.sagaRepository.findAll(sagaIds);
        data.sagas.add(...sagas);
      }

      await this.taskRepository.persistAndFlush(data);

      // worker mock
      if (data.assignee?.role.name === BaseRole.WORKER) {
        this.workerService.emit('new-task', data);
      }

      return {
        status: HttpStatus.CREATED,
        data,
      };
    } catch (e) {
      throw new RpcException({
        status: HttpStatus.PRECONDITION_FAILED,
      });
    }
  }

  async findAll({ limit, offset, wid, ...rest }: GetTasksDto, agent: IAgent) {
    const _where = { wid };

    // creator | READ_ANY_TASK
    if (!agent.role?.privileges.includes(Privilege.READ_ANY_TASK)) {
      _where['creator.id'] = agent.id;
    }

    const where = Object.keys(rest).reduce((acc, key) => {
      if (!(Task.isSearchable(key) && rest[key])) return acc;
      acc[key] = rest[key];
      return acc;
    }, _where);

    const [items, total] = await this.taskRepository.findAndCount(where, {
      orderBy: { [rest['sort.field'] || 'id']: rest['sort.order'] || 'ASC' },
      limit: +limit + 1,
      offset: +offset,
    });

    return {
      status: HttpStatus.OK,
      data: {
        hasMore: items.length === +limit + 1,
        items: items.slice(0, limit),
        total,
      },
    };
  }

  async findOne(id: string, agent: IAgent) {
    const data = await this.taskRepository.findOne(id);

    if (!data) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
      };
    }

    // creator | READ_ANY_TASK
    if (
      data.creator.id !== agent.id &&
      !agent.role?.privileges.includes(Privilege.READ_ANY_TASK)
    ) {
      return {
        status: HttpStatus.FORBIDDEN,
        data: null,
      };
    }

    return {
      status: HttpStatus.OK,
      data,
    };
  }

  async update({ id, ...rest }: UpdateTaskDto, agent: Agent) {
    try {
      const res = await this.findOne(id, agent);
      if (!res.data) return res as ResponseDto;

      // creator | EDIT_ANY_TASK
      if (
        res.data.creator.id !== agent.id &&
        !agent.role?.privileges.includes(Privilege.EDIT_ANY_TASK)
      ) {
        return {
          status: HttpStatus.FORBIDDEN,
          data: null,
        };
      }

      // increment update records
      const records: UpdateRecord[] = Object.keys(rest).reduce((all, field) => {
        const prev = res.data[field];
        const next = rest[field];
        if (!prev || next === prev) return all;
        return all.concat(new UpdateRecord({ prev, next, field }));
      }, []);

      res.data.updates.push(new TaskUpdate({ records, agent }));

      this.taskRepository.assign(res.data, rest);
      if (rest.assigneeId) {
        res.data.assignee = await this.agentRepository.findOne(rest.assigneeId);
      }

      if (rest.sagaIds) {
        const sagas = await this.sagaRepository.findAll(rest.sagaIds);
        res.data.sagas.add(...sagas);
      }

      await this.taskRepository.persistAndFlush(res.data);

      // worker mock
      if (records.some((record) => record.next === BaseRole.WORKER)) {
        this.workerService.emit('new-task', res.data);
      }

      return {
        status: HttpStatus.OK,
        data: res.data,
      };
    } catch (e) {
      throw new RpcException({
        status: HttpStatus.PRECONDITION_FAILED,
      });
    }
  }

  async remove(id: string, agent: IAgent) {
    try {
      const res = await this.findOne(id, agent);
      if (!res.data) return res as ResponseDto;

      // creator | DELETE_ANY_TASK
      if (
        res.data.creator.id !== agent.id &&
        !agent.role?.privileges.includes(Privilege.DELETE_ANY_TASK)
      ) {
        return {
          status: HttpStatus.FORBIDDEN,
          data: null,
        };
      }

      await this.taskRepository.nativeDelete(id);

      return {
        status: HttpStatus.OK,
        data: null,
      };
    } catch (e) {
      throw new RpcException({
        status: HttpStatus.PRECONDITION_FAILED,
      });
    }
  }
}
