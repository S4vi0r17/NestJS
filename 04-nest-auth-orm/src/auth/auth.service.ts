import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger('AuthService');

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
        message: 'User signed up successfully',
        user: userWithoutPassword,
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
        select: { email: true, password: true },
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
        message: 'User signed in successfully',
        user: userWithoutPassword,
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
