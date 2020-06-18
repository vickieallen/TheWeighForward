import { Component, OnInit, Input } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';
@Component({
  selector: 'app-daily-usage-graph',
  templateUrl: './daily-usage-graph.component.html',
  styleUrls: ['./daily-usage-graph.component.scss'],
})
export class DailyUsageGraphComponent implements OnInit {
  constructor() {}

  @Input() totalDailyPoints: number;
  @Input() usedDailyPoints: number;
  @Input() pointName: string;
  // Doughnut
  public doughnutChartLabels: Label[];
  public doughnutChartData: MultiDataSet;
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: ChartOptions;

  public doughnutChartColors = [
    { backgroundColor: ['rgba(113, 226, 197, 1)', 'rgba(255, 176, 208, 1)'] },
  ];
  public doughnutChartPlugins = [
    {
      afterDraw: (chart) => {
        const ctx = chart.ctx;

        const topText = this.totalDailyPoints;
        const centerText = `Daily ${this.pointName}`;

        //Get options from the center object in options
        const sidePadding = 60;
        const sidePaddingCalculated =
          (sidePadding / 100) * (chart.innerRadius * 2);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

        //Get the width of the string and also the width of the element minus 10 to give it 5px side padding

        const stringWidth = ctx.measureText(topText).width;
        const elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        const widthRatio = elementWidth / stringWidth;
        const newFontSize = Math.floor(30 * widthRatio);
        const elementHeight = chart.innerRadius * 2;

        //ctx.fillStyle = this.themeService.currentThemeOptions.theme.secondaryColor;
        ctx.font = 40 + 'px Montserrat';
        ctx.fillStyle = 'black';
        ctx.fillText(topText, centerX, centerY - 15);
        ctx.fontStyle = 'bold';
        // Pick a new font size so it will not be larger than the height of label.
        const fontSizeToUse = 15;
        ctx.font = fontSizeToUse + 'px Montserrat';
        ctx.fillStyle = 'black';

        // Draw text in center
        ctx.fillText(centerText, centerX, centerY + 15);

        ctx.font = 25 + 'px Montserrat';
        ctx.fillStyle = this.doughnutChartColors[0].backgroundColor[1];
        ctx.fillText(
          this.totalDailyPoints - this.usedDailyPoints,
          chart.chartArea.left + sidePadding,
          centerY - 15
        );

        ctx.font = 10 + 'px Montserrat';
        ctx.fillText(
          'remaining',
          chart.chartArea.left + sidePadding,
          centerY + 15
        );
        ctx.fillText('used', chart.chartArea.right - sidePadding, centerY + 15);

        ctx.font = 25 + 'px Montserrat';
        ctx.fillStyle = this.doughnutChartColors[0].backgroundColor[0];

        ctx.fillText(
          this.usedDailyPoints,
          chart.chartArea.right - sidePadding,
          centerY - 15
        );

        ctx.font = 10 + 'px Montserrat';

        ctx.fillText('used', chart.chartArea.right - sidePadding, centerY + 15);
      },
    },
  ];

  ngOnInit() {
    console.log(this.usedDailyPoints);
    console.log(this.totalDailyPoints);
    this.doughnutChartLabels = [
      `Used ${this.pointName}`,
      `Total ${this.pointName}`,
    ];
    this.doughnutChartOptions = {
      cutoutPercentage: 90,
      legend: {
        display: false,
      },
    };
    this.usedDailyPoints = 2;

    if (this.usedDailyPoints == 0) {
      this.doughnutChartData = [[this.totalDailyPoints]];
      this.doughnutChartColors = [
        { backgroundColor: ['rgba(255, 176, 208, 1)'] },
      ];
    } else {
      this.doughnutChartData = [[this.usedDailyPoints, this.totalDailyPoints]];
    }
  }
}
