import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../interfaces';
import { RolProtected } from './rol-protected.decorator';
import { UserRolGuard } from '../guards/user-rol/user-rol.guard';
import { ValidRole } from '../interfaces/valid-roles';
import { ClsUserGuard } from '../guards/user-rol/cls-user.guard';

export function Auth(...roles: ValidRole[]) {
  return applyDecorators(
    RolProtected(...roles),
    UseGuards(AuthGuard(), ClsUserGuard, UserRolGuard),
  );
}
