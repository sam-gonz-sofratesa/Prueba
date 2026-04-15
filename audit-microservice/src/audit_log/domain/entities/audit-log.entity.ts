import { AuditAction } from '../enums/audit-action.enum';

export class AuditLogEntity {
  id?: string;
  entityName: string;
  entityId?: string;
  action: AuditAction;
  userId?: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  createdAt?: Date;

  constructor(partial: Partial<AuditLogEntity>) {
    Object.assign(this, partial);
  }
}
