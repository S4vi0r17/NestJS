import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  populateDatabase() {
    return 'Seed data created successfully!';
  }
}
