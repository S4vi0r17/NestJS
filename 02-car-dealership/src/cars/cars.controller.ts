import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  getAllCars() {
    return this.carsService.getAllCars();
  }

  @Get(':carId')
  getCarById(@Param('carId', ParseIntPipe) carId: number) {
    return this.carsService.getCarById(carId);
  }

  @Post()
  addCar(@Body() car: any) {
    return this.carsService.addCar(car);
  }

  @Patch(':carId')
  updateCar(@Param('carId', ParseIntPipe) carId: number, @Body() car: any) {
    return this.carsService.updateCar(carId, car);
  }

  @Delete(':carId')
  deleteCar(@Param('carId', ParseIntPipe) carId: number) {
    return this.carsService.deleteCar(carId);
  }
}
