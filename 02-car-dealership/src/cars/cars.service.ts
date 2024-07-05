import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Car } from './interfaces/car.interface';
import { CreateCarDto, UpdateCarDto } from './dtos';

@Injectable()
export class CarsService {
  private cars: Car[] = [
    // {
    //   id: uuid(),
    //   make: 'Toyota',
    //   model: 'Corolla',
    //   year: 2018,
    // },
    // {
    //   id: uuid(),
    //   make: 'Toyota',
    //   model: 'Camry',
    //   year: 2019,
    // },
    // {
    //   id: uuid(),
    //   make: 'Toyota',
    //   model: 'Prius',
    //   year: 2020,
    // },
  ];

  getAllCars() {
    return this.cars;
  }

  getCarById(carId: string) {
    const car = this.cars.find((car) => car.id === carId);

    if (!car) throw new NotFoundException(`Car with ID ${carId} not found`);

    return car;
  }

  addCar(createCarDto: CreateCarDto) {
    const car = {
      id: uuid(),
      ...createCarDto,
    };

    this.cars.push(car);

    return this.cars;
  }

  updateCar(carId: string, updateCarDto: UpdateCarDto) {
    const carDB = this.getCarById(carId);

    if (updateCarDto.id && updateCarDto.id !== carId) {
      throw new NotFoundException('Car ID cannot be changed');
    }

    this.cars = this.cars.map((c) => {
      if (c.id === carId) {
        return {
          ...carDB,
          ...updateCarDto,
          carId,
        };
      }

      return c;
    });

    return this.cars;
  }

  deleteCar(carId: string) {
    this.getCarById(carId);

    this.cars = this.cars.filter((car) => car.id !== carId);

    return this.cars;
  }

  fillCarsWithSeedData(cars: Car[]) {
    this.cars = cars;
  }
}
