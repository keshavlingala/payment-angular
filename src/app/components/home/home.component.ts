import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../services/data.service";
import {CurrencyType, MessageType, TransactionRequest, TransferTypeCode} from "../../models/models";
import {Observable, of} from "rxjs";
import {MatSelect} from "@angular/material/select";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponent} from "../dialogs/error/error.component";
import {SuccessComponent} from "../dialogs/success/success.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatStepper} from "@angular/material/stepper";

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
  @ViewChild('matStepper') matStepper!: MatStepper;
  lastTransaction = this.data.getLastTransaction();

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {
    this.senderForm = fb.group({
      accountNumber: ['', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
      accountName: [{value: '', disabled: true}],
      clearBalance: [{value: '', disabled: true}],
      senderBIC: [{value: 'HDFCINBBAHM', disabled: true}]
    })
    this.receiverForm = fb.group({
      receiverAccountNumber: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      receiverAccountName: ['', Validators.required],
      receiverBIC: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      receiverBankName: [{value: '', disabled: true}]
    });
    this.employeeForm = fb.group({
      transferTypeCode: ['', Validators.required],
      messageCode: ['', Validators.required],
      amount: ['', Validators.required],
      totalAmount: [{value: 0, disabled: true}]
    })
  }

  ngOnInit() {
    this.transferTypeCodeList = this.data.getTransferTypeCodes();
    this.messageCodes = this.data.getMessageTypeCodes();
  }

  fetchDetails() {
    if (this.senderForm.valid)
      this.data.getCustomerData(this.senderForm.value.accountNumber).subscribe(value => {
        this.senderForm.get('accountName')?.setValue(value.name);
        this.senderForm.get('clearBalance')?.setValue(value.clearBalance);
      }, (error) => {
        this.dialog.open(ErrorComponent, {
          data: error
        }).afterClosed().subscribe(s => this.senderForm.reset())
      });
  }

  fetchBIC() {
    if (this.receiverForm.valid) {
      const {receiverBIC} = this.receiverForm.value;
      this.data.getBankByBIC(receiverBIC).subscribe(val => {
        this.receiverForm.get('receiverBankName')?.setValue(val.name);
      }, error => {
        this.dialog.open(ErrorComponent, {
          data: error
        }).afterClosed().subscribe(s => this.receiverForm.reset())
      })
    }
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
    const {
      accountNumber = '',
      amount = 0,
      messageCode = '',
      receiverAccountName = '',
      receiverAccountNumber = '',
      receiverBIC = '',
      transferTypeCode = ''
    } = {...this.employeeForm.value, ...this.senderForm.value, ...this.receiverForm.value}
    const transactionRequest: TransactionRequest = {
      payload: {
        customerId: accountNumber,
        amount,
        messageCode,
        receiverAccountName,
        receiverAccountNumber,
        receiverBIC,
        transferTypeCode
      }
    }
    this.data.transactionRequest(transactionRequest).subscribe(val => {
      console.log(val);
      this.dialog.open(SuccessComponent)
      this.lastTransaction = this.data.getLastTransaction();
      this.matStepper.reset();
      this.snack.open('Transaction is Successful', 'Dismiss', {
        duration: 1500
      })
    }, error => {
      console.log(error)
      this.dialog.open(ErrorComponent, {
        data: error
      })
    })
  }
}

