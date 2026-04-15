import { Inject, Injectable } from '@nestjs/common';
import { ITokenService, TokenPair } from '../../domain/ports/token.service.interface';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('ITokenService')
    private readonly tokenSvc: ITokenService,
  ) {}

  async execute(refreshToken: string): Promise<TokenPair> {
    // Verifica el refresh token — lanza UnauthorizedException si es inválido
    const payload = this.tokenSvc.verifyRefreshToken(refreshToken);

    // Emite un nuevo par de tokens con el mismo payload
    return this.tokenSvc.generateTokens({
      sub:   payload.sub,
      email: payload.email,
      role:  payload.role,
    });
  }
}
