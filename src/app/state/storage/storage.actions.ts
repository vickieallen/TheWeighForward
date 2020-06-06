import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user';
import { FoodLog } from 'src/app/models/food-log';

export const GetUser = createAction('[Storage] Get User');

export const GetUserSuccess = createAction(
  '[Storage] Get User Success',
  props<{ user: User }>()
);

export const AddUserFoodLog = createAction(
  '[Storage] Add User Food Log',
  props<{ foodLogs: FoodLog[] }>()
);
