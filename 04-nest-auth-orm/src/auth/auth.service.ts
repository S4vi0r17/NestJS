import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async signup(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: __, ...userWithoutPassword } = user;

      return {
        ...userWithoutPassword,
        token: this.generateToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async signin(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: { id: true, email: true, password: true },
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException(`Invalid credentials`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: __, ...userWithoutPassword } = user;

      return {
        ...userWithoutPassword,
        token: this.generateToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  private handleDbExceptions(error: any): never {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') {
      this.logger.error('User already exists');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`User with ${error.detail}`);
    }
    this.logger.error('Error creating user', error);
    throw new BadRequestException('Error creating user');
  }
}
