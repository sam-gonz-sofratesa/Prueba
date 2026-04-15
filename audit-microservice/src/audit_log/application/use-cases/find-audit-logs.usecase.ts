// src/audit-log/application/use-cases/find-audit-logs.usecase.ts

import { Inject, Injectable } from '@nestjs/common';
import type {
  IAuditLogRepository,
  AuditLogFilters,
} from '../../domain/ports/audit-log.repository.interface';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import { FindAuditLogsDto } from '../../interfaces/dtos/find-audit-logs.dto';

@Injectable()
export class FindAuditLogsUseCase {
  constructor(
    @Inject('IAuditLogRepository')
    private readonly auditLogRepo: IAuditLogRepository,
  ) {}

  async execute(dto: FindAuditLogsDto): Promise<AuditLogEntity[]> {
    const filters: AuditLogFilters = {
      entityName: dto.entityName,
      entityId: dto.entityId,
      userId: dto.userId,
      action: dto.action,
      from: dto.from ? new Date(dto.from) : undefined,
      to: dto.to ? new Date(dto.to) : undefined,
    };

    return this.auditLogRepo.findMany(filters);
  }
}
