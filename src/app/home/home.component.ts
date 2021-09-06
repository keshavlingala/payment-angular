import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  senderForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private data: DataService
  ) {
    this.senderForm = fb.group({
      accountNumber: ['', [Validators.required]],
      accountName: [{value: '', disabled: true}],
      clearBalance: [{value: '', disabled: true}],
    })
  }

  ngOnInit(): void {
  }

  fetchDetails() {
    this.data.getCustomerData(this.senderForm.value.accountNumber).subscribe(value => {
      this.senderForm.get('accountName')?.setValue(value.name);
      this.senderForm.get('clearBalance')?.setValue(value.clearBalance);
    });
  }
}
