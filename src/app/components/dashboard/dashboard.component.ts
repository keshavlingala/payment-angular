import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {GoogleChartInterface} from "ng2-google-charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  transferTypeFreq: GoogleChartInterface = {
    chartType: 'ColumnChart',
    dataTable: [],
    options: {
      width: 600,
      height: 400,
      legend: {position: 'top', maxLines: 3},
      isStacked: true
    }
  };
  successFailure: GoogleChartInterface = {
    chartType: 'PieChart',
    dataTable: [],
    options: {
      title: 'Success-Failure Rate',
      slices: {
        0: {offset: 0.3},
        1: {offset: 0.2}
      }
    }
  };
  amountTransfer: GoogleChartInterface = {
    chartType: 'ColumnChart',
    dataTable: [],
    options: {
      width: 600,
      height: 400,
      legend: {position: 'top', maxLines: 3},
      isStacked: true
    }
  };

  constructor(
    private data: DataService
  ) {
  }

  async ngOnInit() {
    const transactions = await this.data.getAllTransactions().toPromise();
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
    this.transferTypeFreq.component?.draw();
    this.successFailure.component?.draw();
    this.amountTransfer.component?.draw()
  }


}
