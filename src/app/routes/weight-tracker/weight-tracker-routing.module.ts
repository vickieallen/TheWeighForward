import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeightTrackerPage } from './weight-tracker.page';

const routes: Routes = [
  {
    path: '',
    component: WeightTrackerPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeightTrackerPageRoutingModule {}
