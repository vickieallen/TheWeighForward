import { Component } from '@angular/core';

import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ModalController,
  PickerController,
  ToastController,
} from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { User, WeighFrequency } from 'src/app/models/user';
import { WeightLog } from 'src/app/models/weight-log';
import * as moment from 'moment';

@Component({
  selector: 'app-weight-tracker',
  templateUrl: 'weight-tracker.page.html',
  styleUrls: ['weight-tracker.page.scss'],
})
export class WeightTrackerPage {
  constructor(
    private storageService: StorageService,
    public modalController: ModalController,
    public pickerController: PickerController,
    public toastController: ToastController
  ) {}
  user: User;
  latestWeight: WeightLog;
  selectedSegment = 'week';
  weightLogHistory: WeightLog[];
  ionViewWillEnter() {
    from(this.storageService.getObject('user'))
      .pipe(
        map((user) => {
          this.user = user;

          if (!!this.user.weightLogs) {
            this.latestWeight = user.weightLogs[user.weightLogs.length - 1];
          } else {
            this.latestWeight = { stones: 12, lbs: 7 } as WeightLog;
          }
          this.weightLogHistory = [];

          if (this.user.weighFrequency == 1) {
            //daily weigh ins
            let currentDate = moment().startOf('day').add(-30, 'd');

            while (currentDate <= moment().startOf('day')) {
              const weightOnThisDay = this.user.weightLogs.find(
                (e) =>
                  moment(e.createDate).startOf('day').format() ===
                  currentDate.format()
              );
              if (!!weightOnThisDay) {
                this.weightLogHistory.push(weightOnThisDay);
              } else {
                this.weightLogHistory.push({
                  createDate: currentDate.toDate(),
                  stones: null,
                  lbs: null,
                });
              }
              currentDate = currentDate.add(1, 'd');
            }

            this.weightLogHistory.reverse();
          } else if (this.user.weighFrequency == 2) {
            const weighInDay = moment()
              .day(moment().day() >= 2 ? 2 : -5)
              .startOf('day');
            //weekly weigh ins
            let currentDate = moment(weighInDay).add(-6, 'week');

            while (currentDate <= weighInDay) {
              const weightThisWeek = this.user.weightLogs.find(
                (e) =>
                  moment(e.createDate)
                    .day(moment(e.createDate).day() >= 2 ? 2 : -5)
                    .startOf('day')
                    .format() === currentDate.format()
              );
              if (!!weightThisWeek) {
                this.weightLogHistory.push({
                  createDate: currentDate.toDate(),
                  stones: weightThisWeek.stones,
                  lbs: weightThisWeek.lbs,
                });
              } else {
                this.weightLogHistory.push({
                  createDate: currentDate.toDate(),
                  stones: null,
                  lbs: null,
                });
              }
              currentDate = currentDate.add(1, 'week');
            }

            this.weightLogHistory.reverse();
          }
        })
      )
      .subscribe();
  }
  segmentChanged($event) {
    this.selectedSegment = $event.detail.value;
  }
  async editTargetWeight() {
    this.openPicker(true);
  }
  async openPicker(setTarget: boolean) {
    console.log(this.latestWeight);

    let selectedWeight = this.latestWeight;

    if (setTarget && !!this.user.targetWeight) {
      selectedWeight = this.user.targetWeight;
    }
    const stoneOptions = [];
    let i = 0;
    while (i < 100) {
      stoneOptions.push({
        text: `${i} stone`,
        value: `${i}`,
      });
      i++;
    }
    const lbOptions = [];
    let x = 0;
    while (x < 14) {
      lbOptions.push({
        text: `${x} lbs`,
        value: `${x}`,
      });
      x = x + +0.5;
    }
    let pickerAction;
    const picker = await this.pickerController.create({
      buttons: [
        {
          text: 'Cancel',
          handler: (value) => {
            pickerAction = 'cancel';
          },
        },
        {
          text: 'Save',
          handler: (value) => {
            pickerAction = 'save';
          },
        },
      ],
      columns: [
        {
          name: 'stones',
          selectedIndex: selectedWeight.stones,
          options: stoneOptions,
        },
        {
          name: 'lbs',
          selectedIndex: selectedWeight.lbs * 2,
          options: lbOptions,
        },
      ],
    });
    await picker.present();
    picker.onDidDismiss().then(async (data) => {
      if (pickerAction === 'save') {
        const stones = await await picker.getColumn('stones');
        const lbs = await picker.getColumn('lbs');

        if (!setTarget) {
          const weightLog = {
            stones: stones.options[stones.selectedIndex].value,
            lbs: lbs.options[lbs.selectedIndex].value,
            createDate: moment().toDate(),
          } as WeightLog;
          if (!!this.user && !!!this.user.weightLogs) {
            this.user.weightLogs = [];
          }
          this.user.weightLogs.push(weightLog);

          this.storageService
            .setObject('user', this.user)
            .then(async (_) => {
              const toast = await this.toastController.create({
                message: 'Weight saved successfully',
                duration: 2000,
              });
              toast.present();
              this.storageService.getObject('user').then((u) => {
                this.user = u;
              });
            })
            .catch(async (_) => {
              const toast = await this.toastController.create({
                message:
                  'There was an error saving your weight please try again',
              });
              toast.present();
            });
        } else {
          const targetWeight = {
            stones: stones.options[stones.selectedIndex].value,
            lbs: lbs.options[lbs.selectedIndex].value,
            createDate: moment().toDate(),
          } as WeightLog;
          if (!!this.user) {
            this.user.targetWeight = {} as WeightLog;
          }
          this.user.targetWeight = targetWeight;

          this.storageService
            .setObject('user', this.user)
            .then(async (_) => {
              const toast = await this.toastController.create({
                message: 'Target saved successfully',
                duration: 2000,
              });
              toast.present();
              this.storageService.getObject('user').then((u) => {
                this.user = u;
              });
            })
            .catch(async (_) => {
              const toast = await this.toastController.create({
                message:
                  'There was an error saving your target please try again',
              });
              toast.present();
            });
        }
      }
    });
  }
}
