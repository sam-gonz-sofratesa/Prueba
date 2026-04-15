import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../../user/domain/ports/user.repository.interface';
import { IPasswordService } from '../../domain/ports/password.service.interface';
import { ITokenService, TokenPair } from '../../domain/ports/token.service.interface';

export interface LoginInput {
  email: string;
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IPasswordService')
    private readonly passwordSvc: IPasswordService,
    @Inject('ITokenService')
    private readonly tokenSvc: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<TokenPair> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user || !user.isActive) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await this.passwordSvc.compare(input.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    return this.tokenSvc.generateTokens({
      sub:   user.id!,
      email: user.email,
      role:  user.role,
    });
  }
}
