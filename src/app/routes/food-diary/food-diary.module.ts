import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FoodDiaryPage } from './food-diary.page';

import { FoodDiaryPageRoutingModule } from './food-diary-routing.module';
import { AddFoodComponent } from './add-food/add-food.component';
import { DailyUsageGraphComponent } from './daily-usage-graph/daily-usage-graph.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FoodDiaryPageRoutingModule,
    ReactiveFormsModule,
    ChartsModule,
  ],
  declarations: [FoodDiaryPage, AddFoodComponent, DailyUsageGraphComponent],
})
export class FoodDiaryPageModule {}
