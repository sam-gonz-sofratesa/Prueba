import { Inject, Injectable } from '@nestjs/common';
import { ITokenService, TokenPair } from '../../domain/ports/token.service.interface';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('ITokenService')
    private readonly tokenSvc: ITokenService,
  ) {}

  async execute(refreshToken: string): Promise<TokenPair> {
    const payload = this.tokenSvc.verifyRefreshToken(refreshToken);

    return this.tokenSvc.generateTokens({
      sub:             payload.sub,
      codigo_empleado: payload.codigo_empleado,
    });
  }
}
