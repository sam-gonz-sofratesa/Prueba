import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

// Domain — port token
// (los tokens 'IUserRepository' e 'IPasswordService' se proveen aqui)

// Infrastructure
import { UserRepository } from './infrastructure/repositories/user.repository';

// Application
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.usecase';
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.usecase';

// Interfaces
import { UserController } from './interfaces/controllers/user.controller';
import { UserHttpController } from './interfaces/controllers/user-http.controller';

// Infrastructure auth (necesario para IPasswordService en CreateUserUseCase)
import { BcryptPasswordService } from '../auth/infrastructure/services/bcrypt-password.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController, UserHttpController],
  providers: [
    // Ports
    { provide: 'IUserRepository',  useClass: UserRepository },
    { provide: 'IPasswordService', useClass: BcryptPasswordService },

    // Use cases
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
  ],
  exports: [
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    // Exportamos el token para que AuthModule lo reutilice
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'IPasswordService', useClass: BcryptPasswordService },
  ],
})
export class UserModule {}
