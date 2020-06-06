import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/models/user';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { AddFoodComponent } from './add-food/add-food.component';
@Component({
  selector: 'app-food-diary',
  templateUrl: 'food-diary.page.html',
  styleUrls: ['food-diary.page.scss']
})
export class FoodDiaryPage  {

  constructor(private storageService: StorageService, public modalController: ModalController) {}
 user: User;


  ionViewWillEnter(){
    from(this.storageService.getObject('user'))
    .pipe(
      map(user => { this.user = user;}))
      .subscribe();
  }

  async addLogItem(){
const modal = await this.modalController.create({component: AddFoodComponent});
modal.present();
  }

 

}
