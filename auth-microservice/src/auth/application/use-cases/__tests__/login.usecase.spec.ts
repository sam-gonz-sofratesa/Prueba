import { UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../login.usecase';
import { UserEntity } from '../../../../user/domain/entities/user.entity';
import { UserRole } from '../../../../user/domain/enums/user-role.enum';

const mockUserRepo = {
  findByEmail: jest.fn(),
};

const mockPasswordSvc = {
  compare: jest.fn(),
};

const mockTokenSvc = {
  generateTokens: jest.fn(),
};

const fakeUser = new UserEntity({
  id:           'abc123',
  email:        'user@test.com',
  passwordHash: 'hashed_password',
  role:         UserRole.USER,
  isActive:     true,
});

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new LoginUseCase(
      mockUserRepo as any,
      mockPasswordSvc as any,
      mockTokenSvc as any,
    );
  });

  it('debe retornar un TokenPair con credenciales validas', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(fakeUser);
    mockPasswordSvc.compare.mockResolvedValue(true);
    mockTokenSvc.generateTokens.mockReturnValue({
      accessToken:  'access_jwt',
      refreshToken: 'refresh_jwt',
    });

    const result = await useCase.execute({
      email:    'user@test.com',
      password: 'password123',
    });

    expect(result.accessToken).toBe('access_jwt');
    expect(result.refreshToken).toBe('refresh_jwt');
    expect(mockTokenSvc.generateTokens).toHaveBeenCalledWith({
      sub:   'abc123',
      email: 'user@test.com',
      role:  UserRole.USER,
    });
  });

  it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'noexiste@test.com', password: 'password123' }),
    ).rejects.toThrow(UnauthorizedException);

    expect(mockPasswordSvc.compare).not.toHaveBeenCalled();
  });

  it('debe lanzar UnauthorizedException si la password es incorrecta', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(fakeUser);
    mockPasswordSvc.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'user@test.com', password: 'wrong_password' }),
    ).rejects.toThrow(UnauthorizedException);

    expect(mockTokenSvc.generateTokens).not.toHaveBeenCalled();
  });

  it('debe lanzar UnauthorizedException si el usuario esta inactivo', async () => {
    const inactiveUser = new UserEntity({ ...fakeUser, isActive: false });
    mockUserRepo.findByEmail.mockResolvedValue(inactiveUser);

    await expect(
      useCase.execute({ email: 'user@test.com', password: 'password123' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
