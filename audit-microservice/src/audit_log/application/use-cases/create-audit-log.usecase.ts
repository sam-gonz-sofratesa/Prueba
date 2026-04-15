// src/audit-log/application/use-cases/create-audit-log.usecase.ts

import { Inject, Injectable } from '@nestjs/common';
import type { IAuditLogRepository } from '../../domain/ports/audit-log.repository.interface';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import { CreateAuditLogDto } from '../../interfaces/dtos/create-audit-log.dto';

@Injectable()
export class CreateAuditLogUseCase {
  constructor(
    @Inject('IAuditLogRepository')
    private readonly auditLogRepo: IAuditLogRepository,
  ) {}

  async execute(dto: CreateAuditLogDto): Promise<void> {
    const entity = new AuditLogEntity({
      entityName: dto.entityName,
      entityId: dto.entityId,
      action: dto.action,
      userId: dto.userId,
      before: dto.before,
      after: dto.after,
    });

    await this.auditLogRepo.create(entity);
  }
}
