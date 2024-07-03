import { Injectable } from '@nestjs/common';

@Injectable()
export class CarsService {
  private cars = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Corolla',
      year: 2018,
    },
    {
      id: 2,
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
    },
    {
      id: 3,
      make: 'Toyota',
      model: 'Prius',
      year: 2020,
    },
  ];

  getAllCars() {
    return this.cars;
  }

  getCarById(carId: number) {
    return this.cars.find((car) => car.id === carId);
  }

  addCar(car) {
    this.cars.push(car);
    return this.cars;
  }

  updateCar(carId: number, car) {
    const index = this.cars.findIndex((car) => car.id === carId);
    this.cars[index] = car;
    return this.cars;
  }

  deleteCar(carId: number) {
    this.cars = this.cars.filter((car) => car.id !== carId);
    return this.cars;
  }
}
