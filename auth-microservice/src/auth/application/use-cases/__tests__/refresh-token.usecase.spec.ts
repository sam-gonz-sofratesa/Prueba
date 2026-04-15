import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenUseCase } from '../refresh-token.usecase';
import { UserRole } from '../../../../user/domain/enums/user-role.enum';

const mockTokenSvc = {
  verifyRefreshToken: jest.fn(),
  generateTokens:     jest.fn(),
};

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RefreshTokenUseCase(mockTokenSvc as any);
  });

  it('debe generar un nuevo TokenPair con refresh token valido', async () => {
    mockTokenSvc.verifyRefreshToken.mockReturnValue({
      sub:   'abc123',
      email: 'user@test.com',
      role:  UserRole.USER,
    });
    mockTokenSvc.generateTokens.mockReturnValue({
      accessToken:  'new_access_jwt',
      refreshToken: 'new_refresh_jwt',
    });

    const result = await useCase.execute('valid_refresh_token');

    expect(mockTokenSvc.verifyRefreshToken).toHaveBeenCalledWith('valid_refresh_token');
    expect(mockTokenSvc.generateTokens).toHaveBeenCalledWith({
      sub:   'abc123',
      email: 'user@test.com',
      role:  UserRole.USER,
    });
    expect(result.accessToken).toBe('new_access_jwt');
    expect(result.refreshToken).toBe('new_refresh_jwt');
  });

  it('debe lanzar UnauthorizedException si el refresh token es invalido', async () => {
    mockTokenSvc.verifyRefreshToken.mockImplementation(() => {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    });

    await expect(
      useCase.execute('invalid_token'),
    ).rejects.toThrow(UnauthorizedException);

    expect(mockTokenSvc.generateTokens).not.toHaveBeenCalled();
  });
});
