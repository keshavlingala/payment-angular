import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {GoogleChartInterface} from "ng2-google-charts";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  subs: Subscription[] = []
  annotationChart: GoogleChartInterface = {
    chartType: 'AnnotationChart',
    options: {
      title: '',
      displayAnnotations: true,
      height: 500
    }
  };
  comboChart: GoogleChartInterface = {
    chartType: 'ComboChart',
    options: {
      title: '',
      vAxis: {title: 'Sum of Transaction Amount'},
      hAxis: {title: 'Dates'},
      seriesType: 'bars',
      series: {5: {type: 'line'}},
      height: 400
      // isStacked: 'relative',
    }
  };
  private common = {
    // width: 600,
    height: 400,
    animation: {
      duration: 1000,
      easing: 'out',
    },
  }
  transferTypeFreq: GoogleChartInterface = {
    chartType: 'ColumnChart',
    // dataTable: [],
    options: {
      title: '',
      ...this.common,
      legend: {position: 'top', maxLines: 3},
      isStacked: true,
      is3D: true
    }
  };
  successFailure: GoogleChartInterface = {
    chartType: 'PieChart',
    // dataTable: [],
    options: {
      ...this.common,
      title: '',
      is3D: true,
      slices: {
        0: {offset: 0.3},
        1: {offset: 0.2}
      }
    }
  };
  amountTransfer: GoogleChartInterface = {
    chartType: 'ColumnChart',
    // dataTable: [],
    options: {
      title: '',
      ...this.common,
      isStacked: true,
      legend: {position: 'top'},
      // width: 700
    }
  };
  messageCount: GoogleChartInterface = {
    chartType: 'PieChart',
    // dataTable: [],
    options: {
      ...this.common,
      title: '',
      legend: {position: 'right'},
      is3D: true,
    }
  }
  topCustomers: GoogleChartInterface = {
    chartType: 'BarChart',
    // dataTable: [],
    options: {
      ...this.common,
      title: '',
      legend: {position: 'top'}
    }
  }
  amountByBanks: GoogleChartInterface = {
    chartType: 'PieChart',
    // dataTable: [],
    options: {
      title: '',
      ...this.common,
      legend: {position: 'right'},
      is3D: true
    }
  }

  constructor(
    private data: DataService,
    private snack: MatSnackBar
  ) {
  }

  initObservables() {
    this.subs.push(this.data.getAllTransactions().subscribe(transactions => {
      const countWithDates: { [key: string]: number[] } = {}
      transactions.forEach(item => {
        if (!countWithDates[(new Date(item.timestamp)).toLocaleDateString()]) {
          countWithDates[(new Date(item.timestamp)).toLocaleDateString()] = [0, 0, 0, 0]
        }
        countWithDates[(new Date(item.timestamp)).toLocaleDateString()][0] += item.transferCode == 'O' ? 1 : 0
        countWithDates[(new Date(item.timestamp)).toLocaleDateString()][1] += item.transferCode == 'C' ? 1 : 0
        countWithDates[(new Date(item.timestamp)).toLocaleDateString()][2] += item.status == 'SUCCESS' ? item.amount : 0;
        countWithDates[(new Date(item.timestamp)).toLocaleDateString()][3] += item.status == 'FAILED' ? item.amount : 0;
      })
      this.transferTypeFreq.dataTable = [['Date', 'Bank Transfer of Own', 'Customer Transfer', {role: 'annotation'}],
        ...Object.entries(countWithDates).map(i => [i[0], i[1][0], i[1][1], ''])]
      this.amountTransfer.dataTable = [['Date', 'Success Amount', 'Failed Amount', {role: 'annotation'}],
        ...Object.entries(countWithDates).map(i => [i[0], i[1][2], i[1][3], ''])]
      const rates = {
        'SUCCESS': 0,
        'FAILED': 0
      }
      transactions.forEach(item => {
        rates[item.status]++
      })
      this.successFailure.dataTable = [['Status', 'Number of Transactions'], ...Object.entries(rates)];
      this.refreshCharts();
    }));
    this.subs.push(this.data.getMessageCounts().subscribe(value => {
      this.messageCount.dataTable = [['Message Code', 'Number of Transactions'], ...value];
      this.refreshCharts();
    }))
    this.subs.push(this.data.getTopCustomers().subscribe(value => {
      this.topCustomers.dataTable = [['Customer Name', 'Amount'], ...value];
      this.refreshCharts();
    }))
    this.subs.push(this.data.getAmountByBanks().subscribe(value => {
      this.amountByBanks.dataTable = [['Bank Name', 'Amount'], ...value];
      this.refreshCharts();
    }))
    this.subs.push(this.data.getDateStats().subscribe(value => {
      this.annotationChart.dataTable = [['Date', 'Success Amount', 'Failed Amount', 'Customer Transfer', 'Bank Transfer', 'Date String'],
        ...value.map(obj => {
          obj.push(obj[0]);
          obj[0] = new Date(obj[0]);
          return obj;
        })]
      this.refreshCharts();
    }))
    this.subs.push(this.data.getDateStats().subscribe(value => {
      this.comboChart.dataTable = [['Date', 'Success Amount', 'Failed Amount', 'Customer Transfer', 'Bank Transfer'],
        ...value]
      this.refreshCharts();
    }))


  }

  ngOnInit() {
    this.initObservables();
  }

  ngOnDestroy(): void {
    this.subs.forEach(i => i.unsubscribe());
  }

  fabRefresh() {
    this.snack.open('Charts Refreshed', 'Dismiss', {
      duration: 1500
    })
    this.initObservables();
  }

  ready() {
    console.log('Ready')
  }

  refreshCharts() {
    try {
      this.transferTypeFreq?.component?.draw();
      this.successFailure?.component?.draw();
      this.amountTransfer?.component?.draw();
      this.messageCount?.component?.draw();
      this.topCustomers?.component?.draw();
      this.amountByBanks?.component?.draw();
      this.annotationChart?.component?.draw();
      this.comboChart?.component?.draw();
    } catch (e) {
    }
  }
}
