import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  codigo_empleado: string;

  @IsString()
  @MinLength(8)
  password: string;
}
