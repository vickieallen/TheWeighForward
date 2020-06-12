import { Component } from '@angular/core';

import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ModalController,
  PickerController,
  ToastController,
} from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/models/user';
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
  ionViewWillEnter() {
    from(this.storageService.getObject('user'))
      .pipe(
        map((user) => {
          this.user = user;
          this.segmentChanged({ detail: { value: 'week' } });
          if (!!this.user.weightLogs) {
            this.latestWeight = user.weightLogs[user.weightLogs.length - 1];
          } else {
            this.latestWeight = { stones: 12, lbs: 7 } as WeightLog;
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
      x++;
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
          selectedIndex: this.latestWeight.stones,
          options: stoneOptions,
        },
        {
          name: 'lbs',
          selectedIndex: this.latestWeight.lbs,
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
