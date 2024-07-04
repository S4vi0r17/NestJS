import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto } from './dtos';

@Controller('cars')
// @UsePipes(ValidationPipe)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  getAllCars() {
    return this.carsService.getAllCars();
  }

  @Get(':carId')
  getCarById(@Param('carId', ParseUUIDPipe) carId: string) {
    return this.carsService.getCarById(carId);
  }

  @Post()
  // @UsePipes(ValidationPipe)
  // addCar(@Body() createCarDto: CreateCarDto) {
  addCar(@Body() car: CreateCarDto) {
    return this.carsService.addCar(car);
  }

  @Patch(':carId')
  updateCar(
    @Param('carId', ParseUUIDPipe) carId: string,
    @Body() car: UpdateCarDto,
  ) {
    return this.carsService.updateCar(carId, car);
  }

  @Delete(':carId')
  deleteCar(@Param('carId', ParseUUIDPipe) carId: string) {
    return this.carsService.deleteCar(carId);
  }
}
