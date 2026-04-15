// src/audit-log/infrastructure/repositories/audit-log.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  IAuditLogRepository,
  AuditLogFilters,
} from '../../domain/ports/audit-log.repository.interface';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import { AuditLogMapper } from '../mappers/audit-log.mapper';

@Injectable()
export class AuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: AuditLogEntity): Promise<void> {
    await this.prisma.auditLog.create({
      data: AuditLogMapper.toPrisma(entity),
    });
  }

  async findMany(filters: AuditLogFilters): Promise<AuditLogEntity[]> {
    const docs = await this.prisma.auditLog.findMany({
      where: {
        entityName: filters.entityName,
        entityId: filters.entityId,
        userId: filters.userId,
        action: filters.action,
        createdAt: {
          gte: filters.from,
          lte: filters.to,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return docs.map(AuditLogMapper.toDomain);
  }

  async findOlderThan(date: Date): Promise<AuditLogEntity[]> {
    const docs = await this.prisma.auditLog.findMany({
      where: { createdAt: { lt: date } },
    });

    return docs.map(AuditLogMapper.toDomain);
  }

  async archiveMany(logs: AuditLogEntity[]): Promise<void> {
    await this.prisma.auditLogArchive.createMany({
      data: logs.map((entity) => ({
        entityName: entity.entityName,
        entityId: entity.entityId ?? null,
        action: entity.action,
        userId: entity.userId ?? null,
        before: entity.before ?? null,
        after: entity.after ?? null,
        createdAt: entity.createdAt ?? new Date(),
      })),
    });
  }

  async deleteManyOlderThan(date: Date): Promise<void> {
    await this.prisma.auditLog.deleteMany({
      where: { createdAt: { lt: date } },
    });
  }
}
