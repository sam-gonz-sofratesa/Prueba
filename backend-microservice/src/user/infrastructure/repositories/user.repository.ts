import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IUserRepository } from '../../domain/ports/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: UserEntity): Promise<UserEntity> {
    const raw = await this.prisma.user.create({
      data: UserMapper.toPrisma(entity),
    });
    return UserMapper.toDomain(raw);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findByCodigo(codigo_empleado: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { codigo_empleado } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findByNumeroIdentificacion(numero_identificacion: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { numero_identificacion } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async update(id: string, partial: Partial<UserEntity>): Promise<UserEntity> {
    const raw = await this.prisma.user.update({
      where: { id },
      data:  partial,
    });
    return UserMapper.toDomain(raw);
  }
}
