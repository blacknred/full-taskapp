import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseDto } from './dto/response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('createUser')
  create(
    @Payload() createUserDto: CreateUserDto,
  ): Promise<ResponseDto<CreateUserDto>> {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('getAllUsers')
  findAll(
    @Payload() params: Partial<CreateUserDto>,
  ): Promise<ResponseDto<UpdateUserDto[]>> {
    return this.usersService.findAll(params);
  }

  @MessagePattern('getOneUser')
  findOne(@Payload() id: number): Promise<ResponseDto<UpdateUserDto>> {
    return this.usersService.findOne(id);
  }

  @MessagePattern('updateUser')
  update(
    @Payload() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<UpdateUserDto>> {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload() id: number): Promise<ResponseDto> {
    return this.usersService.remove(id);
  }
}
