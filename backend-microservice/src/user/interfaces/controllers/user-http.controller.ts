// Controller HTTP — expuesto directamente via REST (Postman / gateway)
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id.usecase';
import { CreateUserDto } from '../dtos/create-user.dto';

@Controller('users')
export class UserHttpController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findById: FindUserByIdUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findById.execute(id);
  }
}
