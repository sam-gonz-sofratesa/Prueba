import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BcryptPasswordService } from '../auth/infrastructure/services/bcrypt-password.service';

// Infrastructure
import { UserRepository } from './infrastructure/repositories/user.repository';

// Application
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.usecase';
import { FindUserByCodigoUseCase } from './application/use-cases/find-user-by-email.usecase';

// Interfaces
import { UserController } from './interfaces/controllers/user.controller';
import { UserHttpController } from './interfaces/controllers/user-http.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController, UserHttpController],
  providers: [
    { provide: 'IUserRepository',  useClass: UserRepository },
    { provide: 'IPasswordService', useClass: BcryptPasswordService },
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUserByCodigoUseCase,
  ],
  exports: [
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUserByCodigoUseCase,
    { provide: 'IUserRepository',  useClass: UserRepository },
    { provide: 'IPasswordService', useClass: BcryptPasswordService },
  ],
})
export class UserModule {}
