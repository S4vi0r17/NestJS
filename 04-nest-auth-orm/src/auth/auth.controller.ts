import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/get-raw.decorator';
import { Request } from 'express';
import { UserRoleGuard } from './guard/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles.interface';
import { Auth } from './decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('signin')
  signin(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signin(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: Request['rawHeaders'],
  ) {
    return {
      message: 'You are authenticated',
      user,
      userEmail,
      rawHeaders,
    };
  }

  @Get('private2')
  @SetMetadata('roles', ['admin', 'superuser'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute2(@GetUser() user: User) {
    return {
      message: 'You are authenticated',
      user,
    };
  }

  @Get('private3')
  @RoleProtected(ValidRoles.admin, ValidRoles.superuser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute3(@GetUser() user: User) {
    return {
      message: 'You are authenticated',
      user,
    };
  }

  @Get('private4')
  @Auth(ValidRoles.admin, ValidRoles.superuser)
  // @Auth() // free access
  testingPrivateRoute4(@GetUser() user: User) {
    return {
      message: 'You are authenticated',
      user,
    };
  }
}
