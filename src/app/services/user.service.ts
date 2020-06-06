import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private storageService: StorageService) { 
    from(this.storageService.getObject('user'))
      .pipe(
        map(user => { this._currentUser = user}))
        .subscribe();
  }
  private _currentUser : User;
     public get currentUser(){
       return this._currentUser;
     }
  
}
