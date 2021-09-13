import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snack: MatSnackBar) {
    this.loginForm = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    if(this.auth.isLoggedIn){
      this.router.navigate(['/home'])
    }
  }

  login() {
    const {username, password} = this.loginForm.value;
    this.auth.login(username, password).subscribe(async value => {

      await this.router.navigate(['home'])
    }, error => {
      console.error(error);
      this.loginForm.reset();
      this.loginForm.setErrors({
        message: error.error.message,
        description: error.error.description
      })
    })
  }

  register() {
    const {username, password} = this.loginForm.value;
    this.auth.register(username, password).subscribe(val => {

      this.loginForm.reset();
      this.snack.open('Registration Success', 'Dismiss', {
        duration: 1500
      })
    }, error => {
      console.error(error);
      this.loginForm.reset();
      this.loginForm.setErrors({
        message: error.error.message,
        description: error.error.description
      })
    })
  }
}
