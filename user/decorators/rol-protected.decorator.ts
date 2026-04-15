import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { ValidRole } from '../interfaces/valid-roles';

export const META_ROLES = 'roles';

export const RolProtected = (...args: ValidRole[]) => {
  return SetMetadata(META_ROLES, args);
};
