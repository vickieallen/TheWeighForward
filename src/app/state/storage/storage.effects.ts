import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StorageService } from '../../services/storage.service';
import { EMPTY, Observable, from } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as fromActions from './storage.actions';
import { UserService } from 'src/app/services/user.service';
@Injectable()
export class BriskPlusEffects {
  constructor(
    private actions$: Actions,
    private storageService: StorageService
  ) {}
    getUser$ =
     createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GetUser),
      mergeMap((payload) =>
        from((this.storageService.getObject('user'))).pipe(
          map((user) => fromActions.GetUserSuccess({ user: user })),
          catchError(() => EMPTY)
        )
      )
    )
 // );
}
