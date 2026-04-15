import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from '../../../user/domain/ports/user.repository.interface';
import type { IPasswordService } from '../../domain/ports/password.service.interface';
import type {
  ITokenService,
  TokenPair,
} from '../../domain/ports/token.service.interface';

export interface LoginInput {
  codigo_empleado: string;
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
    const user = await this.userRepo.findByCodigo(input.codigo_empleado);
    if (!user || !user.isActive)
      throw new UnauthorizedException('Credenciales inválidas');

    const valid = await this.passwordSvc.compare(
      input.password,
      user.passwordHash,
    );
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    return this.tokenSvc.generateTokens({
      sub: user.id!,
      codigo_empleado: user.codigo_empleado,
    });
  }
}
