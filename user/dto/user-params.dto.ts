import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class UserParamsDto extends PaginationDto {
  @Type(() => String)
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  @IsOptional()
  rol: string[];

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  departamento: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  proyecto: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(3)
  codigo_empleado: string;
}

export class UserRolDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  userRolsIds: string[];
}
