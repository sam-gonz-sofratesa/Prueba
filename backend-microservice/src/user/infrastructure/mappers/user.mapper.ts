import { UserEntity } from '../../domain/entities/user.entity';

// Tipo local que refleja el modelo Prisma User
type PrismaUser = {
  id: string;
  nombre_apellido: string;
  codigo_empleado: string;
  sexo: string;
  tipo_identificacion: string;
  numero_identificacion: string;
  isActive: boolean;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UserMapper {
  static toDomain(raw: PrismaUser): UserEntity {
    return new UserEntity({
      id: raw.id,
      nombre_apellido: raw.nombre_apellido,
      codigo_empleado: raw.codigo_empleado,
      sexo: raw.sexo,
      tipo_identificacion: raw.tipo_identificacion,
      numero_identificacion: raw.numero_identificacion,
      isActive: raw.isActive,
      passwordHash: raw.passwordHash,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPrisma(entity: UserEntity) {
    return {
      nombre_apellido: entity.nombre_apellido,
      codigo_empleado: entity.codigo_empleado,
      sexo: entity.sexo,
      tipo_identificacion: entity.tipo_identificacion,
      numero_identificacion: entity.numero_identificacion,
      isActive: entity.isActive ?? true,
      passwordHash: entity.passwordHash,
    };
  }
}
