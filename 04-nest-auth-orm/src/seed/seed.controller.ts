import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
// import { Auth } from '../auth/decorators/auth.decorator';
// import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  // @Auth()
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.executeSeed();
  }
}
