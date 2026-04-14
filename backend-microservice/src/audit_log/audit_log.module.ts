// src/audit-log/audit-log.module.ts

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ClsModule } from 'nestjs-cls';

// Prisma
import { PrismaModule } from '../prisma/prisma.module';

// Application — use cases
import { CreateAuditLogUseCase } from './application/use-cases/create-audit-log.usecase';
import { FindAuditLogsUseCase } from './application/use-cases/find-audit-logs.usecase';
import { ArchiveAuditLogsUseCase } from './application/use-cases/archive-audit-logs.usecase';

// Infrastructure
import { AuditLogRepository } from './infrastructure/repositories/audit-log.repository';
import { AuditMiddleware } from './infrastructure/middleware/audit.middleware';
import { ArchiveAuditTask } from './infrastructure/tasks/archive-audit.task';
import { AuditLogController } from './audit_log.controller';

// Interfaces

@Module({
  imports: [PrismaModule, ClsModule, ScheduleModule.forRoot()],
  controllers: [AuditLogController],
  providers: [
    {
      provide: 'IAuditLogRepository',
      useClass: AuditLogRepository,
    },

    // Use cases
    CreateAuditLogUseCase,
    FindAuditLogsUseCase,
    ArchiveAuditLogsUseCase,

    // Infrastructure
    AuditMiddleware,
    ArchiveAuditTask,
  ],
  exports: [PrismaModule, CreateAuditLogUseCase],
})
export class AuditLogModule {}
