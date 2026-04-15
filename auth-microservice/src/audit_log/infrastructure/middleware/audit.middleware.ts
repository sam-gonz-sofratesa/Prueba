// src/audit-log/infrastructure/middleware/audit.middleware.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAuditLogUseCase } from '../../application/use-cases/create-audit-log.usecase';
import { AuditAction } from '../../domain/enums/audit-action.enum';

const AUDIT_MODELS = ['AuditLog', 'AuditLogArchive'];

const ACTION_MAP: Partial<Record<string, AuditAction>> = {
  create: AuditAction.INSERT,
  update: AuditAction.UPDATE,
  delete: AuditAction.REMOVE,
  updateMany: AuditAction.UPDATE,
  deleteMany: AuditAction.REMOVE,
};

@Injectable()
export class AuditMiddleware implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
    private readonly createAuditLog: CreateAuditLogUseCase,
  ) {}

  onModuleInit() {
    // Prisma 5: se extiende el cliente con query extensions
    const auditMiddleware = this;

    (this.prisma as any)._extensions = (this.prisma as any)._extensions ?? [];

    const extended = this.prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            if (AUDIT_MODELS.includes(model ?? '')) {
              return query(args);
            }

            const action = ACTION_MAP[operation];
            if (!action) return query(args);

            // Capturar estado anterior
            let before: any = null;
            if (operation === 'update' || operation === 'delete') {
              const delegate = (auditMiddleware.prisma as any)[
                model!.charAt(0).toLowerCase() + model!.slice(1)
              ];
              before = await delegate.findUnique({ where: args.where });
            }

            const result = await query(args);

            // Detectar soft-delete / restore
            let resolvedAction = action;
            if (operation === 'update') {
              const data = (args as any)?.data;

              if (before?.isActive === true && data?.isActive === false) {
                resolvedAction = AuditAction.SOFT_DELETE;
              } else if (
                before?.isActive === false &&
                data?.isActive === true
              ) {
                resolvedAction = AuditAction.RESTORE;
              }

              const keys = Object.keys(data ?? {}).filter(
                (k) => !['updatedAt', 'id'].includes(k),
              );
              if (keys.length === 0) return result;
            }

            const entityId =
              (args as any)?.where?.id ?? (result as any)?.id ?? null;

            const after =
              operation !== 'delete' &&
              result &&
              typeof result === 'object' &&
              !Array.isArray(result)
                ? (result as Record<string, any>)
                : undefined;

            await auditMiddleware.createAuditLog.execute({
              entityName: model!,
              entityId: entityId ? String(entityId) : undefined,
              action: resolvedAction,
              userId: auditMiddleware.cls.get('userId') ?? undefined,
              before: before ?? undefined,
              after,
            });

            return result;
          },
        },
      },
    });

    // Reemplazar los delegates del prisma original con los del extendido
    Object.assign(this.prisma, extended);
  }
}
