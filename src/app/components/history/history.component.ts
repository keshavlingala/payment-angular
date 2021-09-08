import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TransactionItem} from "../../models/models";
import {DataService} from "../../services/data.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistoryComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<TransactionItem>;
  columns = ['transactionID', 'senderName', 'senderAccountNumber', 'receiverName', 'receiverAccountNumber', 'transferCode', 'amount', 'date'];
  expandedElement: TransactionItem | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedChip: 'Yesterday' | 'Today' | 'None' = 'None';
  dates = ['Yesterday', 'Today', 'None'];
  filterString: string = ''

  constructor(
    private data: DataService
  ) {
    this.dataSource = new MatTableDataSource();
    const old = this.dataSource.filterPredicate
    console.log(old)
    this.dataSource.filterPredicate = (val, search) => {
      const date = new Date(val.timestamp);
      return (date.toString().toLocaleLowerCase() +
          date.toDateString() + date.toISOString() +
          date.toLocaleDateString() +
          date.toUTCString() +
          date.toTimeString() +
          date.toLocaleTimeString())
          .toLowerCase().includes(search.toLowerCase()) ||
        JSON.stringify(val).toLowerCase().includes(search.toLowerCase()) ||
        old(val, search)
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    this.dataSource.data = await this.data.getAllTransactions().toPromise();
    console.log(this.dataSource.data)
    this.dataSource.filter = this.filterString;
  }

  asTransaction(obj: any): TransactionItem {
    return obj as TransactionItem
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterString = filterValue.toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.filter = this.filterString;
  }

  changeSelected(i: string) {
    // @ts-ignore
    this.selectedChip = i;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const obj: { [key: string]: string; } = {
      'Today': new Date().toDateString(),
      'Yesterday': yesterday.toDateString(),
      'None': ''
    }
    this.filterString = obj[this.selectedChip]
    this.dataSource.filter = this.filterString;
  }
}
