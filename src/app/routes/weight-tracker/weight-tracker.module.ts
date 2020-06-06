import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeightTrackerPage } from './weight-tracker.page';

import { WeightTrackerPageRoutingModule } from './weight-tracker-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    WeightTrackerPageRoutingModule
  ],
  declarations: [WeightTrackerPage]
})
export class WeightTrackerPageModule {}
