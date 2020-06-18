import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { FormBuilder } from '@angular/forms';

import * as moment from 'moment';
import { FoodLog } from 'src/app/models/food-log';
@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.scss'],
})
export class AddFoodComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private fb: FormBuilder,
    private storageService: StorageService,
    private toastController: ToastController
  ) {}
  currentUser: User;
  foodLogForm = this.fb.group({
    description: [''],
    numberOfSyns: [0],
  });
  ngOnInit() {
    from(this.storageService.getObject('user'))
      .pipe(
        map((user) => {
          this.currentUser = user;
        })
      )
      .subscribe();
  }

  dismiss() {
    console.log('dismiss');
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  onSubmit() {
    const form = this.foodLogForm.value;
    console.log(form);
    // const foodLog = {
    //   description: form.description,
    //   numberOfSyns: form.numberOfSyns,
    //   createDate: moment().toDate(),
    // } as FoodLog;
    if (!!this.currentUser && !!!this.currentUser.foodLogs) {
      this.currentUser.foodLogs = [];
    }
    //this.currentUser.foodLogs.push(foodLog);
    this.storageService
      .setObject('user', this.currentUser)
      .then(async (_) => {
        const toast = await this.toastController.create({
          message: 'Food log saved successfully',
          duration: 2000,
        });
        toast.present();
      })
      .catch(async (_) => {
        const toast = await this.toastController.create({
          message: 'There was an error saving your food log please try again',
        });
        toast.present();
      });

    this.dismiss();
  }
}
