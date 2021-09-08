import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LOGIN_URL, REGISTER_URL} from "../models/constant";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string = ''

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.token = localStorage.getItem('token') || ''
  }

  get isLoggedIn(): boolean {
    return this.token != '';
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ jwt: string }>(LOGIN_URL, {username, password}).pipe(
      map(res => {
        this.token = res.jwt
        localStorage.setItem('token', res.jwt);
        return res;
      })
    )
  }

  register(username: string, password: string) {
    return this.http.post<any>(REGISTER_URL, {username, password});
  }

  logout() {
    localStorage.clear();
    this.token = '';
    this.router.navigate(['/login'])
  }
}
