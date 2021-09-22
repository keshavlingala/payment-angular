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
  columns = ['transactionID', 'senderName', 'senderAccountNumber',
    'receiverName', 'receiverAccountNumber', 'transferCode', 'amount', 'date', 'status'];
  expandedElement: TransactionItem | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedChip: string = 'None';
  chips: { [key: string]: string; } = {}
  filterString: string = ''

  constructor(
    private data: DataService
  ) {
    this.dataSource = new MatTableDataSource();
    const old = this.dataSource.filterPredicate
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

    this.dataSource.filter = this.filterString;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.chips = {
      'Failed': 'FAILED',
      'Success': 'SUCCESS',
      'Today': new Date().toDateString(),
      'Yesterday': yesterday.toDateString(),
      'None': ''
    }
  }

  asTransaction(obj: any): TransactionItem {
    return obj as TransactionItem
  }

  applyFilter(event: Event) {
    this.filterString = (event.target as HTMLInputElement).value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.filter = this.filterString.toLowerCase();
  }

  changeSelected(i: string) {
    // @ts-ignore
    this.selectedChip = i;
    this.filterString = this.chips[this.selectedChip]
    this.dataSource.filter = this.filterString;
  }

  getChipKeys() {
    return Object.keys(this.chips)
  }

  getIcon(element: any) {
    if (this.asTransaction(element).status == 'SUCCESS') return 'done'
    return 'close'
  }
}
