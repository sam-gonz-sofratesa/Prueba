import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';
import { CreateUserDto } from './create-user.dto';
import { OmitType } from '@nestjs/mapped-types';
import { PASSWORD_MSG, PASSWORD_REGEX } from 'src/common/constantes/constantes';

export class CreateUserAdminDto extends OmitType(CreateUserDto, [
  'proyectoId',
] as const) {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  proyectoId?: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @MaxLength(25)
  @MinLength(8)
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MSG })
  password: string;
}
