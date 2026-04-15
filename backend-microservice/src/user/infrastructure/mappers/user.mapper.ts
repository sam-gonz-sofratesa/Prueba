import { UserEntity } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';

// Tipo local para no depender del cliente Prisma generado en tiempo de compilacion
type PrismaUser = {
  id:           string;
  email:        string;
  passwordHash: string;
  role:         string;
  isActive:     boolean;
  createdAt:    Date;
  updatedAt:    Date;
};

export class UserMapper {
  static toDomain(raw: PrismaUser): UserEntity {
    return new UserEntity({
      id:           raw.id,
      email:        raw.email,
      passwordHash: raw.passwordHash,
      role:         raw.role as UserRole,
      isActive:     raw.isActive,
      createdAt:    raw.createdAt,
      updatedAt:    raw.updatedAt,
    });
  }

  static toPrisma(entity: UserEntity) {
    return {
      email:        entity.email,
      passwordHash: entity.passwordHash,
      role:         entity.role,
      isActive:     entity.isActive ?? true,
    };
  }
}
