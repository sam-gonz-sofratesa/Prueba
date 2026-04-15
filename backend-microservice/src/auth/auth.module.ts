import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// User module (reutiliza IUserRepository, IPasswordService y use cases)
import { UserModule } from '../user/user.module';

// Infrastructure
import { JwtTokenService } from './infrastructure/services/jwt-token.service';

// Application
import { LoginUseCase } from './application/use-cases/login.usecase';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.usecase';

// Interfaces
import { AuthController } from './interfaces/controllers/auth.controller';
import { AuthHttpController } from './interfaces/controllers/auth-http.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}), // secrets se pasan en cada sign/verify via process.env
  ],
  controllers: [AuthController, AuthHttpController],
  providers: [
    // Port
    { provide: 'ITokenService', useClass: JwtTokenService },

    // Use cases
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
  ],
})
export class AuthModule {}
