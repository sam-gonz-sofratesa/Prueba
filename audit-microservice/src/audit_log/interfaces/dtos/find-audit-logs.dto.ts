import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { AuditAction } from '../../domain/enums/audit-action.enum';

export class FindAuditLogsDto {
  @IsString()
  @IsOptional()
  entityName?: string;

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsEnum(AuditAction)
  @IsOptional()
  action?: AuditAction;

  @IsDateString()
  @IsOptional()
  from?: string; // ISO string → el use case lo convierte a Date

  @IsDateString()
  @IsOptional()
  to?: string;
}
