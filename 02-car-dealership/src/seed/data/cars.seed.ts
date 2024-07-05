import { v4 as uuid } from 'uuid';
import { Car } from 'src/cars/interfaces/car.interface';

export const CARS_SEED: Car[] = [
  {
    id: uuid(),
    make: 'Toyota',
    model: 'Corolla',
    year: 2018,
  },
  {
    id: uuid(),
    make: 'Toyota',
    model: 'Camry',
    year: 2019,
  },
  {
    id: uuid(),
    make: 'Toyota',
    model: 'Prius',
    year: 2020,
  },
];
