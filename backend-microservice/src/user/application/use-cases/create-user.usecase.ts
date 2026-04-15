import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/ports/user.repository.interface';
import { IPasswordService } from '../../../auth/domain/ports/password.service.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';

export interface CreateUserInput {
  email: string;
  password: string;
  role?: UserRole;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IPasswordService')
    private readonly passwordSvc: IPasswordService,
  ) {}

  async execute(input: CreateUserInput): Promise<UserEntity> {
    const exists = await this.userRepo.findByEmail(input.email);
    if (exists) throw new ConflictException('El email ya está registrado');

    const passwordHash = await this.passwordSvc.hash(input.password);

    return this.userRepo.create(
      new UserEntity({
        email:        input.email,
        passwordHash,
        role:         input.role ?? UserRole.USER,
        isActive:     true,
      }),
    );
  }
}
