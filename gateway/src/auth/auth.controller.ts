import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { EmptyResponseDto } from './dto/empty-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IAuthedRequest } from './interfaces/authed-request.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  @Post()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login' })
  @ApiCreatedResponse({ type: EmptyResponseDto })
  create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() createAuthDto: CreateAuthDto,
  ): EmptyResponseDto {
    return { data: null };
  }

  @Get()
  @ApiOperation({ summary: 'Get Session data' })
  @ApiCreatedResponse({ type: UserResponseDto })
  async getOne(@Req() { user }: IAuthedRequest): Promise<UserResponseDto> {
    return { data: user };
  }

  @Delete()
  @ApiOperation({ summary: 'Logout' })
  @ApiCreatedResponse({ type: EmptyResponseDto })
  delete(@Req() req): EmptyResponseDto {
    req.logout();
    return { data: null };
  }
}