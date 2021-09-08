import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  GET_BANK_DATA,
  GET_CUSTOMER_DATA,
  GET_MESSAGE_CODE_DATA,
  GET_TRANSACTIONS,
  POST_TRANSACTION
} from "../models/constant";
import {
  Bank,
  Customer,
  MessageType,
  TransactionItem,
  TransactionRequest,
  TransactionResponse,
  TransferTypeCode
} from "../models/models";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) {
  }

  getCustomerData(cid: string): Observable<Customer> {
    return this.http.get<Customer>(GET_CUSTOMER_DATA + cid);
  }

  getBankByBIC(receiverBIC: string): Observable<Bank> {
    return this.http.get<Bank>(GET_BANK_DATA + receiverBIC)
  }

  getTransferTypeCodes(): Observable<TransferTypeCode[]> {
    return of([
      {value: 'C', name: 'Customer Transfer'},
      {value: 'O', name: 'Bank Transfer of Own'}
    ])
  }

  getMessageTypeCodes(): Observable<MessageType[]> {
    return this.http.get<MessageType[]>(GET_MESSAGE_CODE_DATA);
  }

  getLastTransaction(): TransactionResponse {
    return <TransactionResponse>JSON.parse(localStorage.getItem('lastMade') || 'false');
  }

  getAllTransactions() {
    return this.http.get<TransactionItem[]>(GET_TRANSACTIONS);
  }

  transactionRequest(transactionRequest: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(POST_TRANSACTION, transactionRequest).pipe(
      map(res => {
        localStorage.setItem('lastMade', JSON.stringify(res));
        return res;
      })
    )
  }
}
