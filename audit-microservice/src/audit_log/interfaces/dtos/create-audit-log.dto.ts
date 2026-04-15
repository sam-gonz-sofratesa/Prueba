import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuditAction } from '../../domain/enums/audit-action.enum';

export class CreateAuditLogDto {
  @IsString()
  @IsNotEmpty()
  entityName: string;

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsEnum(AuditAction)
  @IsNotEmpty()
  action: AuditAction;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsOptional()
  before?: Record<string, any>;

  @IsOptional()
  after?: Record<string, any>;
}
