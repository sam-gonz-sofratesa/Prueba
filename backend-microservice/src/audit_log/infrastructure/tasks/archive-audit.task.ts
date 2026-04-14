import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArchiveAuditLogsUseCase } from '../../application/use-cases/archive-audit-logs.usecase';

@Injectable()
export class ArchiveAuditTask {
  constructor(private readonly archiveAuditLogs: ArchiveAuditLogsUseCase) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handle() {
    await this.archiveAuditLogs.execute();
  }
}
