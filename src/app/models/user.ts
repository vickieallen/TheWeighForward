import { FoodLog } from './food-log';

export interface User {
    userName: string;
    numberOfSyns: number;
    synName: string;
    foodLogs: FoodLog[];
}