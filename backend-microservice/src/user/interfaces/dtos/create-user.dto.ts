import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 125)
  nombre_apellido: string;

  @IsString()
  @Length(1, 15)
  codigo_empleado: string;

  @IsString()
  @IsIn(['M', 'F', 'O'])
  sexo: string;

  @IsString()
  tipo_identificacion: string;

  @IsString()
  numero_identificacion: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
