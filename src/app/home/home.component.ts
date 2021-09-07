import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../data.service";
import {CurrencyType, MessageType, TransferTypeCode} from "../models/models";
import {Observable, of} from "rxjs";
import {MatSelect} from "@angular/material/select";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class HomeComponent implements OnInit {
  senderForm: FormGroup
  receiverForm: FormGroup
  employeeForm: FormGroup
  transferTypeCodeList: Observable<TransferTypeCode[]> = of([]);
  messageCodes: Observable<MessageType[]> = of([])
  currencyTypes: CurrencyType[] = [
    {code: 'EUR', name: 'Euro', value: 84, symbol: '€'},
    {code: 'GBP', name: 'Great British Pound', value: 102, symbol: '£'},
    {code: 'INR', name: 'Indian Rupees', value: 1, symbol: '₹'},
    {code: 'JPY', name: 'Japanese Yen', value: 1, symbol: '¥'},
    {code: 'USD', name: 'US Dollar', value: 74, symbol: '$'}
  ]
  @ViewChild('currencyInput') matSelect!: MatSelect;

  constructor(
    private fb: FormBuilder,
    private data: DataService
  ) {
    this.senderForm = fb.group({
      accountNumber: ['', [Validators.required]],
      accountName: [{value: '', disabled: true}],
      clearBalance: [{value: '', disabled: true}],
      senderBIC: [{value: 'HDFCINBBAHM', disabled: true}]
    })
    this.receiverForm = fb.group({
      receiverAccountNumber: ['', Validators.required],
      receiverAccountName: ['', Validators.required],
      receiverBIC: ['', Validators.required],
      receiverBankName: [{value: '', disabled: true}]
    });
    this.employeeForm = fb.group({
      transferTypeCode: ['', Validators.required],
      messageCode: ['', Validators.required],
      amount: ['', Validators.required],
      currency: ['1', Validators.required],
      totalAmount: [{value: 0, disabled: true}]
    })
  }

  async ngOnInit() {
    this.transferTypeCodeList = this.data.getTransferTypeCodes();
    this.messageCodes = this.data.getMessageTypeCodes();
  }

  fetchDetails() {
    this.data.getCustomerData(this.senderForm.value.accountNumber).subscribe(value => {
      this.senderForm.get('accountName')?.setValue(value.name);
      this.senderForm.get('clearBalance')?.setValue(value.clearBalance);
    });
  }

  fetchBIC() {
    const {receiverBIC} = this.receiverForm.value;
    this.data.getBankByBIC(receiverBIC).subscribe(val => {
      this.receiverForm.get('receiverBankName')?.setValue(val.name);
    })
  }

  getCurrencyItem() {
    return this.currencyTypes.find(val => this.matSelect?.value == val.code) || this.currencyTypes[2];
  }

  updateINR() {
    const amount = this.employeeForm.get('amount')?.value
    this.employeeForm.get('totalAmount')?.setValue(this.getCurrencyItem().value * amount)
  }

  getETC() {
    return this.employeeForm.get('totalAmount')?.value + this.employeeForm.get('totalAmount')?.value * 0.0025;
  }

  submit() {
    console.log({...this.employeeForm.value, ...this.senderForm.value, ...this.receiverForm.value})
  }
}
