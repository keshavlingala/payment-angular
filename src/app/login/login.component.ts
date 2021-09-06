import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  login() {
    const {username, password} = this.loginForm.value;
    this.auth.login(username, password).subscribe(async value => {
      console.log(value);
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
      console.log(val);
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
