import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/models/user';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { AddFoodComponent } from './add-food/add-food.component';
import { FoodLog } from 'src/app/models/food-log';
import * as moment from 'moment';
@Component({
  selector: 'app-food-diary',
  templateUrl: 'food-diary.page.html',
  styleUrls: ['food-diary.page.scss'],
})
export class FoodDiaryPage {
  constructor(
    private storageService: StorageService,
    public modalController: ModalController
  ) {}
  user: User;
  currentLog: FoodLog;
  currentDate: Date = moment().toDate();
  usedSyns = 0;

  ionViewWillEnter() {
    from(this.storageService.getObject('user'))
      .pipe(
        map((user) => {
          this.user = user;

          this.currentLog = this.user.foodLogs.find(
            (e) =>
              moment(e.date).startOf('day') ===
              moment(this.currentDate).startOf('day')
          );
          if (!!!this.currentLog) {
            this.currentLog = {} as FoodLog;
          }
          const breakfastSyns = !!this.currentLog.breakfast
            ? this.currentLog.breakfast
                .map((item) => item.numberOfPoints)
                .reduce((prev, next) => prev + next)
            : 0;
          const lunchSyns = !!this.currentLog.lunch
            ? this.currentLog.lunch
                .map((item) => item.numberOfPoints)
                .reduce((prev, next) => prev + next)
            : 0;
          const dinnerSyns = !!this.currentLog.dinner
            ? this.currentLog.dinner
                .map((item) => item.numberOfPoints)
                .reduce((prev, next) => prev + next)
            : 0;
          const snackSyns = !!this.currentLog.snacks
            ? this.currentLog.snacks
                .map((item) => item.numberOfPoints)
                .reduce((prev, next) => prev + next)
            : 0;
          this.usedSyns = breakfastSyns + +lunchSyns + +dinnerSyns + +snackSyns;

          console.log(this.usedSyns);
        })
      )
      .subscribe();
  }

  getDate() {
    console.log(moment(this.currentDate).startOf('day'));
    console.log(moment().startOf('day'));
    if (
      moment(this.currentDate).startOf('day').format() ==
      moment().startOf('day').format()
    ) {
      return 'Today';
    } else if (
      moment(this.currentDate).startOf('day').format() ==
      moment().add(-1, 'day').startOf('day').format()
    ) {
      return 'Yesterday';
    } else {
      console.log(moment(this.currentDate).format('Do MMM'));
      return moment(this.currentDate).format('Do MMM');
    }
  }

  goForward() {
    this.currentDate = moment(this.currentDate).add(1, 'day').toDate();
    this.currentLog = this.user.foodLogs.find(
      (e) =>
        moment(e.date).startOf('day') ===
        moment(this.currentDate).startOf('day')
    );
    if (!!this.currentLog) {
      this.currentLog = {} as FoodLog;
    }
  }

  goBackward() {
    this.currentDate = moment(this.currentDate).add(1, 'day').toDate();
    this.currentLog = this.user.foodLogs.find(
      (e) =>
        moment(e.date).startOf('day') ===
        moment(this.currentDate).startOf('day')
    );
    if (!!this.currentLog) {
      this.currentLog = {} as FoodLog;
    }
  }

  async addLogItem() {
    const modal = await this.modalController.create({
      component: AddFoodComponent,
    });

    modal.onDidDismiss().then((_) => {
      from(this.storageService.getObject('user'))
        .pipe(
          map((user) => {
            this.user = user;
          })
        )
        .subscribe();
    });
    modal.present();
  }
}
