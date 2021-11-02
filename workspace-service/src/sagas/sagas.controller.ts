import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Agent } from 'src/__shared__/decorators/agent.decorator';
import { AgentGuard } from 'src/__shared__/guards/agent.guard';
import { ResponseDto } from '../__shared__/dto/response.dto';
import { CreateSagaDto } from './dto/create-saga.dto';
import { GetSagaDto } from './dto/get-saga.dto';
import { GetSagasDto } from './dto/get-sagas.dto';
import { SagaResponseDto, SagasResponseDto } from './dto/response.dto';
import { UpdateSagaDto } from './dto/update-saga.dto';
import { SagasService } from './sagas.service';

@Controller('sagas')
@UseGuards(AgentGuard)
export class SagasController {
  constructor(private readonly sagasService: SagasService) {}

  @MessagePattern('create')
  create(
    @Agent() agent,
    @Payload() createSagaDto: CreateSagaDto,
  ): Promise<SagaResponseDto> {
    return this.sagasService.create(createSagaDto, agent);
  }

  @MessagePattern('getAll')
  getAll(
    @Agent() agent,
    @Payload() getSagasDto: GetSagasDto,
  ): Promise<SagasResponseDto> {
    return this.sagasService.findAll(getSagasDto, agent);
  }

  @MessagePattern('getOne')
  getOne(
    @Agent() agent,
    @Payload() { id }: GetSagaDto,
  ): Promise<SagaResponseDto> {
    return this.sagasService.findOne(id, agent);
  }

  @MessagePattern('update')
  update(
    @Agent() agent,
    @Payload() updateSagaDto: UpdateSagaDto,
  ): Promise<SagaResponseDto> {
    return this.sagasService.update(updateSagaDto, agent);
  }

  @MessagePattern('delete')
  remove(@Agent() agent, @Payload() { id }: GetSagaDto): Promise<ResponseDto> {
    return this.sagasService.remove(id, agent);
  }
}