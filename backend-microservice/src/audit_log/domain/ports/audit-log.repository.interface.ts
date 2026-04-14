import { AuditLogEntity } from '../entities/audit-log.entity';

export interface AuditLogFilters {
  entityName?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  from?: Date;
  to?: Date;
}

export interface IAuditLogRepository {
  create(entity: AuditLogEntity): Promise<void>;
  findMany(entity: AuditLogFilters): Promise<AuditLogEntity[]>;
  findOlderThan(date: Date): Promise<AuditLogEntity[]>;
  archiveMany(logs: AuditLogEntity[]): Promise<void>;
  deleteManyOlderThan(date: Date): Promise<void>;
}
