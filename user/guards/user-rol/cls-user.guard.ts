import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class ClsUserGuard implements CanActivate {
  constructor(private readonly cls: ClsService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (req.user?.id) this.cls.set('userId', req.user.id);
    return true;
  }
}
