import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeightTrackerPage } from './weight-tracker.page';

import { WeightTrackerPageRoutingModule } from './weight-tracker-routing.module';
import { WeightGraphComponent } from './weight-graph/weight-graph.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    WeightTrackerPageRoutingModule,
    ChartsModule,
  ],
  declarations: [WeightTrackerPage, WeightGraphComponent],
})
export class WeightTrackerPageModule {}
