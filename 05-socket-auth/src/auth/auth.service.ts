import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async signup(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
        omit: { password: true, createdAt: true, updatedAt: true },
      });

      return {
        ...user,
        token: this.generateToken({ id: user.id }),
      };
    } catch (error) {
      const prismaError = error as {
        code?: string;
        meta?: { target?: string[] };
      };
      if (
        prismaError.code === 'P2002' &&
        prismaError.meta?.target?.includes('email')
      ) {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException(
        'Unable to create user, please check server logs',
      );
    }
  }

  async signin(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      omit: { createdAt: true, updatedAt: true },
    });

    if (!user) {
      throw new BadRequestException(`User with email ${email} not found`);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException(`Invalid credentials`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      token: this.generateToken({ id: user.id }),
    };
  }
}
