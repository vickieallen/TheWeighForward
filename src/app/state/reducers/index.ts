import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import { clearState } from '../meta-reducers/clear-state.reducer';
export interface AppState {}
export const reducers: ActionReducerMap<AppState> = {};
export function logger(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return function (state: AppState, action: any): AppState {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}
export const metaReducers: MetaReducer<AppState>[] = [clearState];
