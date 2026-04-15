import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import { AuditAction } from '../../domain/enums/audit-action.enum';
import { AuditLog } from '@prisma/client';
export class AuditLogMapper {
  static toDomain(doc: AuditLog): AuditLogEntity {
    return new AuditLogEntity({
      id: doc.id,
      entityName: doc.entityName,
      entityId: doc.entityId ?? undefined,
      action: doc.action as AuditAction,
      userId: doc.userId ?? undefined,
      before: (doc.before as Record<string, any>) ?? undefined,
      after: (doc.after as Record<string, any>) ?? undefined,
      createdAt: doc.createdAt,
    });
  }

  static toPrisma(entity: AuditLogEntity): Omit<AuditLog, 'id' | 'createdAt'> {
    return {
      entityName: entity.entityName,
      entityId: entity.entityId ?? null,
      action: entity.action,
      userId: entity.userId ?? null,
      before: entity.before ?? null,
      after: entity.after ?? null,
    };
  }
}
