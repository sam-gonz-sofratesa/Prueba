import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/ports/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(id: string): Promise<UserEntity> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return user;
  }
}
