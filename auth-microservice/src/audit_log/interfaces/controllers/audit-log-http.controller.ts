import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CreateAuditLogUseCase } from '../../application/use-cases/create-audit-log.usecase';
import { FindAuditLogsUseCase } from '../../application/use-cases/find-audit-logs.usecase';

@Controller('audit-log')
export class AuditLogHttpController {
  constructor(
    private readonly createAuditLog: CreateAuditLogUseCase,
    private readonly findAuditLogs: FindAuditLogsUseCase,
  ) {}

  @Post()
  create(@Body() dto: any) {
    return this.createAuditLog.execute(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.findAuditLogs.execute(query);
  }
}
