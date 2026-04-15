// src/audit-log/application/use-cases/archive-audit-logs.usecase.ts

import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IAuditLogRepository } from '../../domain/ports/audit-log.repository.interface';

@Injectable()
export class ArchiveAuditLogsUseCase {
  private readonly logger = new Logger(ArchiveAuditLogsUseCase.name);

  constructor(
    @Inject('IAuditLogRepository')
    private readonly auditLogRepo: IAuditLogRepository,
  ) {}

  async execute(): Promise<void> {
    // Primer día del mes actual como fecha de corte
    const now = new Date();
    const cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);

    const logs = await this.auditLogRepo.findOlderThan(cutoffDate);

    if (logs.length === 0) {
      this.logger.log('No hay logs para archivar');
      return;
    }

    await this.auditLogRepo.archiveMany(logs);
    await this.auditLogRepo.deleteManyOlderThan(cutoffDate);

    this.logger.log(
      `Archivados ${logs.length} logs anteriores a ${cutoffDate.toISOString()}`,
    );
  }
}
