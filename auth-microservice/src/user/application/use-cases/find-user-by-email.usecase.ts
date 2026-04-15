import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class FindUserByCodigoUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(codigo_empleado: string): Promise<UserEntity> {
    const user = await this.userRepo.findByCodigo(codigo_empleado);
    if (!user)
      throw new NotFoundException(
        `Usuario con código ${codigo_empleado} no encontrado`,
      );
    return user;
  }
}
