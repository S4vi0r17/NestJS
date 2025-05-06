import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ValidRoles } from '../interfaces/valid-roles.interface';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guard/user-role.guard';

export const Auth = (...args: ValidRoles[]) => {
  return applyDecorators(
    RoleProtected(...args),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
};
