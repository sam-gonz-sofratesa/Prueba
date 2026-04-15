import { IsString } from 'class-validator';

export class FindUserByIdDto {
  @IsString()
  id: string;
}

export class FindUserByCodigoDto {
  @IsString()
  codigo_empleado: string;
}
