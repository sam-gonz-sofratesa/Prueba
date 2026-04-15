import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @MaxLength(125)
  @MinLength(3)
  @Matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?: [A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/) //TODO: esta espresión regular no toma en cuenta nombres como juan de luque, o apellidos con apelativos o sus equivalentes
  nombre_apellido: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(3)
  codigo_empleado: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['M', 'F'], { message: `El sexo debe ser "M" o "F"` })
  sexo: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['cédula', 'pasaporte'], {
    message: `El tipo de identificacion debe ser "cedula" o "pasaporte"`,
  })
  tipo_identificacion: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  @Matches(/^(\d{3}-\d{7}-\d{1}|[A-Z0-9]{6,15})$/i)
  numero_identificacion: string;

  @Type(() => String)
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  rolId: string[];

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  departamentoId: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  proyectoId: string;
}
