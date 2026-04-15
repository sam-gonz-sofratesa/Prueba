import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/ports/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(email: string): Promise<UserEntity> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    return user;
  }
}
