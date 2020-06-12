import { FoodLog } from './food-log';
import { WeightLog } from './weight-log';

export interface User {
  userName: string;
  numberOfSyns: number;
  synName: string;
  foodLogs: FoodLog[];
  weightLogs: WeightLog[];
  targetWeight: WeightLog;
}
