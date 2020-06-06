import { Component, OnInit, Input } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
@Component({
  selector: 'app-daily-usage-graph',
  templateUrl: './daily-usage-graph.component.html',
  styleUrls: ['./daily-usage-graph.component.scss'],
})
export class DailyUsageGraphComponent implements OnInit {
  constructor() {}

  @Input() totalDailyPoints: number;
  @Input() usedDailyPoints: number;
  // Doughnut
  public doughnutChartLabels: Label[] = ['Used points', 'Total points'];
  public doughnutChartData: MultiDataSet;
  public doughnutChartType: ChartType = 'doughnut';

  ngOnInit() {
    console.log(this.usedDailyPoints);
    console.log(this.totalDailyPoints);
    this.doughnutChartData = [[this.usedDailyPoints, 15]];
  }
}
