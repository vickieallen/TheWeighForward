import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StorageState } from './storage.reducer';
const selectStorageState = createFeatureSelector<StorageState>('storage');
export const selectUser = createSelector(
  selectStorageState,
  (state) => state.user
);
