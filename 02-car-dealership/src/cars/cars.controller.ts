import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto } from './dto';

@Controller('cars')
// @UsePipes(ValidationPipe) // Apply validation pipe globally for all routes in this controller
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  // @UsePipes(ValidationPipe)
  addCar(@Body() createCarDto: CreateCarDto) {
    return this.carsService.addCar(createCarDto);
  }

  @Get()
  getAllCars() {
    return this.carsService.getAllCars();
  }

  @Get(':carId')
  getCarById(@Param('carId', ParseUUIDPipe) carId: string) {
    return this.carsService.getCarById(carId);
  }

  @Patch(':carId')
  updateCar(
    @Param('carId', ParseUUIDPipe) carId: string,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    return this.carsService.updateCar(carId, updateCarDto);
  }

  @Delete(':carId')
  deleteCar(@Param('carId', ParseUUIDPipe) carId: string) {
    return this.carsService.deleteCar(carId);
  }
}
