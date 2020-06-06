import { Action, createReducer, on, resultMemoize } from '@ngrx/store';
import { User } from '../../models/user';
import * as fromActions from './storage.actions';
export const initialState = {
  user: {} as User,
};
export interface StorageState {
  user: User;
}
const storageReducer = createReducer(
  initialState,

  on(fromActions.GetUserSuccess, (state, { user }) => ({
    ...state,
    user: user,
  }))
);
export function StorageReducer(
  state: StorageState | undefined,
  action: Action
) {
  return storageReducer(state, action);
}
