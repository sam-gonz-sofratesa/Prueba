import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firma: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  @Matches(
    /^(?=.*[A-ZÁÉÍÓÚÑ])(?=.*[a-záéíóúñ])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-zÁÉÍÓÚáéíóúÑñ\d@$!%*?&._-]{8,25}$/,
  )
  password: string;
}
