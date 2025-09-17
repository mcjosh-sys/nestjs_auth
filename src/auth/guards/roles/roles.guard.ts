import { ROLES_KEY } from '@/auth/decorators/role.decorator';
import { Role } from '@lib/generated/prisma';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if(!requiredRoles)
      return true;

    const user = (context.switchToHttp().getRequest() as Request).user
    return requiredRoles.some(role => role === user?.role)
  }
}
