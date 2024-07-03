import { Controller, Get, Param } from '@nestjs/common';

@Controller('cars')
export class CarsController {
  private cars = ['car1', 'car2', 'car3'];

  @Get()
  getAllCars() {
    return this.cars;
  }

  @Get(':carId')
  getCarById(@Param('carId') carId: string) {
    return this.cars[+carId];
  }
}
