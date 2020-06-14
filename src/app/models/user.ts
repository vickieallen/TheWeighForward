import { FoodLog } from './food-log';
import { WeightLog } from './weight-log';

export interface User {
  userName: string;
  numberOfSyns: number;
  synName: string;
  weighFrequency: number;
  weighDay: number;
  foodLogs: FoodLog[];
  weightLogs: WeightLog[];
  targetWeight: WeightLog;
}

export enum WeighFrequency {
  Daily = 1,
  Weekly = 2,
}
