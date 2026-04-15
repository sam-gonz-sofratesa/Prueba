// update-password.dto.ts
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PASSWORD_MSG, PASSWORD_REGEX } from 'src/common/constantes/constantes';

export class UpdatePasswordDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @MaxLength(25)
  @MinLength(8)
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MSG })
  currentPassword: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @MaxLength(25)
  @MinLength(8)
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MSG })
  newPassword: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @MaxLength(25)
  @MinLength(8)
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MSG })
  confirmPassword: string;
}
