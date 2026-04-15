import { Exclude, Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(3)
  codigo_empleado: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
