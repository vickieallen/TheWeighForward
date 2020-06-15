import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { User } from 'src/app/models/user';
import * as moment from 'moment';

@Component({
  selector: 'app-weight-graph',
  templateUrl: './weight-graph.component.html',
  styleUrls: ['./weight-graph.component.scss'],
})
export class WeightGraphComponent implements OnChanges {
  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  public lineChartOptions: any;
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(252, 104, 53,0.3)',
    },
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  @Input() user: User;

  @Input() period: string;
  constructor() {}

  ngOnChanges() {
    //weekly graph
    //this maybe should be a rolling week?

    this.lineChartData = [];
    let labels = [];
    let data = [];
    let targetWeightInLbs = 0;
    let minWeightInLbs = 0;
    let maxWeightInLbs = 0;

    if (!!this.user) {
      this.user.weightLogs.forEach((e) => {
        const date = moment(e.createDate, 'YYYY-MM-DDTHH:mm:ss.SSSSZ');
        console.log(date.format());
        console.log(date.startOf('day').format());
      });

      targetWeightInLbs =
        this.user.targetWeight.stones * 14 + +this.user.targetWeight.lbs;
      //get this week's weight logs

      let currentDate = moment().add(-1, 'week').startOf('day');
      switch (this.period) {
        case 'month': {
          currentDate = moment().add(-1, 'month').startOf('day');
          break;
        }
        case 'year': {
          currentDate = moment().add(-1, 'year').startOf('day');
          break;
        }
        case 'all': {
          currentDate = moment(
            this.user.weightLogs
              .map((c) => c.createDate)
              .reduce(function (a, b) {
                return a < b ? a : b;
              })
          ).startOf('day');
        }
      }
      while (moment().startOf('day') >= currentDate) {
        //is there a matching weight log?
        const weightOnThisDay = this.user.weightLogs.filter(
          (e) =>
            moment(e.createDate).startOf('day').format() ===
            currentDate.format()
        );
        labels.push(`${moment(currentDate).format('Do MMM')}`);
        if (!!weightOnThisDay && weightOnThisDay.length > 0) {
          const stonesInLbs = weightOnThisDay[0].stones * 14;
          const weightInLbs = +stonesInLbs + +weightOnThisDay[0].lbs;
          console.log(weightInLbs);
          data.push(weightInLbs);
        } else {
          data.push(null);
        }

        currentDate = moment(currentDate).add(1, 'd');
        console.log(currentDate);
      }

      maxWeightInLbs = Math.max(...data);
      minWeightInLbs = Math.min(...data.filter((e) => !!e));
    }
    this.lineChartData = [{ data: data }];
    this.lineChartLabels = labels;

    this.lineChartOptions = {
      responsive: true,
      spanGaps: true,
      scales: {
        yAxes: [
          {
            ticks: {
              min: targetWeightInLbs > 0 ? targetWeightInLbs : minWeightInLbs,
              max: maxWeightInLbs,
              stepSize: 7,
              suggestedMin: 0.5,
              suggestedMax: 5.5,
              callback: function (label, index, labels) {
                //work out stone and lb value from lbs

                const stones = Math.floor(label / 14);
                const lbs = label - stones * 14;

                return `${stones}st ${lbs}lbs`;
              },
            },
          },
        ],
      },
    };
  }
}
