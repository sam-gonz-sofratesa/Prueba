import { UserRole } from '../enums/user-role.enum';

export class UserEntity {
  id?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
