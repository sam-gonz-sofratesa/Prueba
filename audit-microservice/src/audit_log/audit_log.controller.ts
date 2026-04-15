// src/audit-log/interfaces/controllers/audit-log.controller.ts

import { Controller } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  Ctx,
  TcpContext,
} from '@nestjs/microservices';
import { FindAuditLogsUseCase } from './application/use-cases/find-audit-logs.usecase';
import { CreateAuditLogUseCase } from './application/use-cases/create-audit-log.usecase';
import { AUDIT_LOG_PATTERNS } from '../shared/constants/audit-log.patterns';
import { CreateAuditLogDto } from './interfaces/dtos/create-audit-log.dto';
import { FindAuditLogsDto } from './interfaces/dtos/find-audit-logs.dto';

@Controller()
export class AuditLogController {
  constructor(
    private readonly createAuditLog: CreateAuditLogUseCase,
    private readonly findAuditLogs: FindAuditLogsUseCase,
  ) {}

  // Fire-and-forget: no retorna respuesta al emisor
  @EventPattern(AUDIT_LOG_PATTERNS.CREATE)
  async create(@Payload() dto: CreateAuditLogDto): Promise<void> {
    await this.createAuditLog.execute(dto);
  }

  // Retorna listado con filtros opcionales
  @MessagePattern(AUDIT_LOG_PATTERNS.FIND_ALL)
  async findAll(@Payload() dto: FindAuditLogsDto) {
    return this.findAuditLogs.execute(dto);
  }

  // Shortcut: buscar por userId directamente
  @MessagePattern(AUDIT_LOG_PATTERNS.FIND_BY_USER)
  async findByUser(@Payload() payload: { userId: string }) {
    return this.findAuditLogs.execute({ userId: payload.userId });
  }

  // Shortcut: buscar por entidad + resourceId
  @MessagePattern(AUDIT_LOG_PATTERNS.FIND_BY_RESOURCE)
  async findByResource(
    @Payload() payload: { entityName: string; entityId: string },
  ) {
    return this.findAuditLogs.execute({
      entityName: payload.entityName,
      entityId: payload.entityId,
    });
  }
}
