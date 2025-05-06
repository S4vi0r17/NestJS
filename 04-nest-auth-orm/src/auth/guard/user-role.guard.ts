import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get<string[]>(
      // 'roles',
      META_ROLES,
      context.getHandler(),
    );

    // If there are no roles defined, we allow access
    if (!validRoles || validRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user as User | undefined;

    if (!user) {
      throw new BadRequestException('User not found (request.user)');
    }

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} needs a valid role: [${validRoles.join(', ')}]`,
    );
  }
}
