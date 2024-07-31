import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  // SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles.enum';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('signin')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth() // Use this to check if the user is authenticated
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() req: Express.Request,
    @GetUser() user: User,
    @GetUser('email') useEmail: string,
    @RawHeaders() rawHerader: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log(req);
    // console.log(user);
    return {
      message: 'This is a private route',
      user,
      useEmail,
      rawHerader,
      headers,
    };
  }

  @Get('private2')
  // @SetMetadata('roles', ['admin'])
  @RoleProtected(ValidRoles.SUPERUSER, ValidRoles.ADMIN)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      message: 'This is a private route 2',
      user,
    };
  }

  @Get('private3')
  // // @SetMetadata('roles', ['admin'])
  // @RoleProtected(ValidRoles.SUPERUSER, ValidRoles.ADMIN)
  // @UseGuards(AuthGuard(), UserRoleGuard)
  @Auth(ValidRoles.SUPERUSER)
  privateRoute3(@GetUser() user: User) {
    return {
      message: 'This is a private route 2',
      user,
    };
  }
}
