import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { FormBuilder } from '@angular/forms';
import { User } from 'src/app/models/user';
import { ToastController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  constructor(
    private storageService: StorageService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private userService: UserService,
    private alertController: AlertController
  ) {}

  userSettingsForm = this.fb.group({
    userName: [''],
    synName: [''],
    numberOfSyns: [15],
    weighFrequency: [1],
    weighDay: [1],
  });

  currentUser: User;

  ionViewWillEnter() {
    this.currentUser = this.userService.currentUser;

    this.userSettingsForm.patchValue({
      userName: this.currentUser.userName,
      synName: this.currentUser.synName,
      numberOfSyns: this.currentUser.numberOfSyns,
      weighFrequency: this.currentUser.weighFrequency.toString(),
      weighDay: this.currentUser.weighDay.toString(),
    });
  }

  onSubmit() {
    const form = this.userSettingsForm.value;
    console.log(form);
    const user = {
      ...this.currentUser,
      userName: form.userName,
      numberOfSyns: form.numberOfSyns,
      synName: form.synName,
      weighFrequency: Number(form.weighFrequency),
      weighDay: Number(form.weighDay),
    } as User;
    this.storageService
      .setObject('user', user)
      .then(async (_) => {
        const toast = await this.toastController.create({
          message: 'Settings saved successfully',
          duration: 2000,
        });
        toast.present();
      })
      .catch(async (_) => {
        const toast = await this.toastController.create({
          message: 'There was an error saving your settings please try again',
        });
        toast.present();
      });
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message:
        'Please confirm you want to remove your weight logs. This cannot be undone',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: do nothing');
          },
        },
        {
          text: 'Confirm',
          handler: () => {
            const user = this.currentUser;
            user.weightLogs = [];
            this.storageService
              .setObject('user', user)
              .then(async (_) => {
                const toast = await this.toastController.create({
                  message: 'Weight logs removed',
                  duration: 2000,
                });
                toast.present();
              })
              .catch(async (_) => {
                const toast = await this.toastController.create({
                  message:
                    'There was an error removing your logs please try again',
                });
                toast.present();
              });
          },
        },
      ],
    });

    alert.present();
  }
  clearWeightLogs() {
    this.presentAlertConfirm();
  }
}
