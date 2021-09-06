import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GET_CUSTOMER_DATA} from "./models/constant";
import {Customer} from "./models/models";
import {Observable} from "rxjs";

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
}
