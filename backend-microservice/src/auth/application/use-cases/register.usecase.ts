import { Inject, Injectable } from '@nestjs/common';
import { CreateUserUseCase, CreateUserInput } from '../../../user/application/use-cases/create-user.usecase';
import { ITokenService, TokenPair } from '../../domain/ports/token.service.interface';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly createUser: CreateUserUseCase,
    @Inject('ITokenService')
    private readonly tokenSvc: ITokenService,
  ) {}

  async execute(input: CreateUserInput): Promise<TokenPair> {
    const user = await this.createUser.execute(input);

    return this.tokenSvc.generateTokens({
      sub:   user.id!,
      email: user.email,
      role:  user.role,
    });
  }
}
