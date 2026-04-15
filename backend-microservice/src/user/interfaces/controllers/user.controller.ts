import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERNS } from '../../../shared/constants/user.patterns';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id.usecase';
import { FindUserByCodigoUseCase } from '../../application/use-cases/find-user-by-email.usecase';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FindUserByIdDto, FindUserByCodigoDto } from '../dtos/find-user.dto';

@Controller()
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findById: FindUserByIdUseCase,
    private readonly findByCodigo: FindUserByCodigoUseCase,
  ) {}

  @MessagePattern(USER_PATTERNS.CREATE)
  create(@Payload() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }

  @MessagePattern(USER_PATTERNS.FIND_BY_ID)
  findUserById(@Payload() dto: FindUserByIdDto) {
    return this.findById.execute(dto.id);
  }

  @MessagePattern(USER_PATTERNS.FIND_BY_EMAIL)
  findUserByCodigo(@Payload() dto: FindUserByCodigoDto) {
    return this.findByCodigo.execute(dto.codigo_empleado);
  }
}
