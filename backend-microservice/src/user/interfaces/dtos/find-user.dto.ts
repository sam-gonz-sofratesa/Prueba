import { IsOptional, IsString } from 'class-validator';

export class FindUserByIdDto {
  @IsString()
  id: string;
}

export class FindUserByEmailDto {
  @IsString()
  @IsOptional()
  email: string;
}
