import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from '../create-user.usecase';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { UserEntity } from '../../../domain/entities/user.entity';

const mockUserRepo = {
  findByEmail: jest.fn(),
  create:      jest.fn(),
};

const mockPasswordSvc = {
  hash:    jest.fn(),
  compare: jest.fn(),
};

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateUserUseCase(
      mockUserRepo as any,
      mockPasswordSvc as any,
    );
  });

  it('debe crear un usuario correctamente', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockPasswordSvc.hash.mockResolvedValue('hashed_password');
    mockUserRepo.create.mockResolvedValue(
      new UserEntity({
        id:           '123',
        email:        'test@test.com',
        passwordHash: 'hashed_password',
        role:         UserRole.USER,
        isActive:     true,
      }),
    );

    const result = await useCase.execute({
      email:    'test@test.com',
      password: 'password123',
    });

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@test.com');
    expect(mockPasswordSvc.hash).toHaveBeenCalledWith('password123');
    expect(mockUserRepo.create).toHaveBeenCalledTimes(1);
    expect(result.email).toBe('test@test.com');
    expect(result.passwordHash).toBe('hashed_password');
    expect(result.role).toBe(UserRole.USER);
  });

  it('debe lanzar ConflictException si el email ya existe', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(
      new UserEntity({ email: 'test@test.com', passwordHash: 'x', role: UserRole.USER }),
    );

    await expect(
      useCase.execute({ email: 'test@test.com', password: 'password123' }),
    ).rejects.toThrow(ConflictException);

    expect(mockPasswordSvc.hash).not.toHaveBeenCalled();
    expect(mockUserRepo.create).not.toHaveBeenCalled();
  });

  it('debe asignar role USER por defecto si no se especifica', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockPasswordSvc.hash.mockResolvedValue('hashed');
    mockUserRepo.create.mockImplementation((entity: UserEntity) =>
      Promise.resolve(entity),
    );

    const result = await useCase.execute({
      email:    'nuevo@test.com',
      password: 'password123',
    });

    expect(result.role).toBe(UserRole.USER);
  });

  it('debe respetar el role ADMIN si se pasa explicitamente', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockPasswordSvc.hash.mockResolvedValue('hashed');
    mockUserRepo.create.mockImplementation((entity: UserEntity) =>
      Promise.resolve(entity),
    );

    const result = await useCase.execute({
      email:    'admin@test.com',
      password: 'password123',
      role:     UserRole.ADMIN,
    });

    expect(result.role).toBe(UserRole.ADMIN);
  });
});
