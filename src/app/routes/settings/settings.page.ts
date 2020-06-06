import { Component, OnInit } from "@angular/core";
import { StorageService } from "../../services/storage.service";
import { FormBuilder } from "@angular/forms";
import { User } from "src/app/models/user";
import { ToastController } from "@ionic/angular";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-settings",
  templateUrl: "settings.page.html",
  styleUrls: ["settings.page.scss"],
})
export class SettingsPage {
  constructor(
    private storageService: StorageService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private userService: UserService
  ) {}

  userSettingsForm = this.fb.group({
    userName: [""],
    synName: [""],
    numberOfSyns: [15],
  });

  currentUser: User;

  ionViewWillEnter() {
    this.currentUser = this.userService.currentUser;

    this.userSettingsForm.patchValue({
      userName: this.currentUser.userName,
      synName: this.currentUser.synName,
      numberOfSyns: this.currentUser.numberOfSyns,
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
      foodLogs: [],
    } as User;
    this.storageService
      .setObject("user", user)
      .then(async (_) => {
        const toast = await this.toastController.create({
          message: "Settings saved successfully",
          duration: 2000,
        });
        toast.present();
      })
      .catch(async (_) => {
        const toast = await this.toastController.create({
          message: "There was an error saving your settings please try again",
        });
        toast.present();
      });
  }
}
