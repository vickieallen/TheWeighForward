export interface FoodLog {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snacks: FoodItem[];
  water: WaterLog[];
  date: Date;
}

export interface FoodItem {
  description: string;
  numberOfPoints: number;
  createDate: Date;
}

export interface WaterLog {
  ml: number;
  createDate;
}
