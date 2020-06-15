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
import { WeightLog } from 'src/app/models/weight-log';
import { LossType } from 'src/app/models/loss-type';
@Component({
  selector: 'app-weight-added',
  templateUrl: './weight-added.component.html',
  styleUrls: ['./weight-added.component.scss'],
})
export class WeightAddedComponent implements OnInit {
  constructor(private modalController: ModalController) {}
  currentUser: User;
  weightLog: WeightLog;
  previousWeightLog: WeightLog;
  lossType: LossType;
  lossSentence: string;
  LossType = LossType;
  ngOnInit() {
    this.calculateLoss();
  }

  calculateLoss() {
    if (!!this.previousWeightLog) {
      const previousLogLbs =
        this.previousWeightLog.stones * 14 + +this.previousWeightLog.lbs;
      const currentLogLbs = this.weightLog.stones * 14 + +this.weightLog.lbs;

      let change = currentLogLbs - previousLogLbs;
      if (change < 0) {
        this.lossSentence = `Wooo. You've lost ${(change *= -1)} lb${
          change > 1 ? 's' : ''
        }`;
        this.lossType = LossType.Loss;
      } else if (change == 0) {
        this.lossType = LossType.Maintain;
        this.lossSentence = 'Maintain - better than a gain!';
      } else {
        this.lossType = LossType.Gain;
        this.lossSentence = `Oh no. You've had a gain of ${change} lb${
          change > 1 ? 's' : ''
        }`;
      }
    } else {
      return '';
    }
  }

  getHeadingText() {
    switch (this.lossType) {
      case LossType.Loss: {
        return 'You are on fire!';
      }
      case LossType.Maintain: {
        return 'Stayed the same';
      }
      case LossType.Gain: {
        return 'Uh oh!';
      }
    }
  }
  dismiss() {
    console.log('dismiss');
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
