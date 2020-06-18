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
import { WeightAddedComponent } from './weight-added/weight-added.component';

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
  startWeight: WeightLog;
  untilTarget: WeightLog;
  targetWeight: WeightLog;
  selectedSegment = 'week';
  weightLogHistory: WeightLog[];
  ionViewWillEnter() {
    from(this.storageService.getObject('user'))
      .pipe(
        map((user) => {
          this.user = user;
          this.targetWeight = this.user.targetWeight;
          if (!!this.user.weightLogs) {
            this.user.weightLogs.sort((val1, val2) => {
              return new Date(val1.createDate) > new Date(val2.createDate)
                ? 1
                : -1;
            });

            this.latestWeight = user.weightLogs[user.weightLogs.length - 1];

            this.startWeight = user.weightLogs[0];

            if (!!this.user.targetWeight) {
              const latestWeightInLbs =
                this.latestWeight.stones * 14 + +this.latestWeight.lbs;
              const targetWeightInLbs =
                this.targetWeight.stones * 14 + +this.targetWeight.lbs;
              const dif = latestWeightInLbs - targetWeightInLbs;
              let stones = 0;
              let lbs = dif;
              if (dif >= 14) {
                const s = dif / 14;
                stones = Math.floor(s);
                lbs = dif - stones * 14;
              } else {
                lbs = dif;
              }
              this.untilTarget = {
                stones: stones,
                lbs: lbs,
              } as WeightLog;
            }
          } else {
            this.latestWeight = { stones: 12, lbs: 7 } as WeightLog;
          }

          this.getWeightLogHistory();
        })
      )
      .subscribe();
  }

  getWeightLogHistory() {
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
    }
    this.weightLogHistory.reverse();
  }
  segmentChanged($event) {
    this.selectedSegment = $event.detail.value;
  }

  getWeightChange(weightLog: WeightLog) {
    const log = this.user.weightLogs.find(
      (e) => e.createDate === weightLog.createDate
    );
    const index = this.user.weightLogs.indexOf(log);
    const previousIndex = index - 1;
    const previousLog = this.user.weightLogs[previousIndex];

    if (!!previousLog) {
      const previousLogLbs = previousLog.stones * 14 + +previousLog.lbs;
      const currentLogLbs = log.stones * 14 + +log.lbs;

      let change = currentLogLbs - previousLogLbs;
      if (change < 0) {
        return `Lost ${(change *= -1)} lb${change > 1 ? 's' : ''}`;
      } else if (change == 0) {
        return 'Maintain';
      } else {
        return `Gain ${change} lb${change > 1 ? 's' : ''}`;
      }
    } else {
      return '';
    }
  }
  async editTargetWeight() {
    this.openPicker(true);
  }
  async openPicker(setTarget: boolean, date: Date = null) {
    console.log(this.latestWeight);

    let selectedWeight = this.latestWeight ?? { stones: 13, lbs: 1 };

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
          const weightLogDate = !!date ? date : moment().toDate();
          const weightLog = {
            stones: stones.options[stones.selectedIndex].value,
            lbs: lbs.options[lbs.selectedIndex].value,
            createDate: weightLogDate,
          } as WeightLog;
          if (!!this.user && !!!this.user.weightLogs) {
            this.user.weightLogs = [];
          }

          let todaysWeight = this.user.weightLogs.find(
            (e) =>
              moment(e.createDate).startOf('day') ===
              moment(weightLogDate).startOf('day')
          );
          if (!!todaysWeight) {
            todaysWeight = weightLog;
          } else {
            this.user.weightLogs.push(weightLog);
          }
          this.storageService
            .setObject('user', this.user)
            .then(async (_) => {
              if (!!date) {
                const toast = await this.toastController.create({
                  message: 'Weight saved successfully',
                  duration: 2000,
                });
                toast.present();
                this.storageService.getObject('user').then((u) => {
                  this.user = u;
                });
              } else {
                const index = this.user.weightLogs.indexOf(weightLog);
                const previousIndex = index - 1;
                const previousLog = this.user.weightLogs[previousIndex];

                const modal = await this.modalController.create({
                  component: WeightAddedComponent,
                  componentProps: {
                    weightLog: weightLog,
                    previousWeightLog: previousLog,
                  },
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

              this.getWeightLogHistory();
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
