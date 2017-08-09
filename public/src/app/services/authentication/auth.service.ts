import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { NgForm } from "@angular/forms";

import { AuthenticationApi } from "../../modules/authentication/authentication-api";
import { IUser } from "app/modules/authentication/user";
var headers = new Headers({ 'Content-Type': 'application/json' });
var options = new RequestOptions({ headers: headers });

@Injectable()
export class AuthenticationService implements AuthenticationApi {
  currentUser: IUser;
  redirectUrl: string;
  changePassoword: () => Observable<any>;
  forgotPassowrd: () => Observable<any>;

  isAuthenticated = false;
  constructor(private router: Router, private http: Http) {
    this.currentUser = null
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  logIn(logInUser:any): Observable<any> {
    console.log('UserService.signIn: ' + logInUser.userName + ' ' + logInUser.password + ' ' + logInUser.rememberMe);
    this.isAuthenticated = true;
    this.currentUser = {
      userName: logInUser.userName
    }
    return this.http.post('http://localhost:3000/auth/login',
      JSON.stringify(logInUser),
      options
    )
    .map((resp: Response) => resp.json())
    .catch(this.handleError);
    //return Observable.of({}).delay(2000);
    // return Observable.of({}).delay(2000).flatMap(x=>Observable.throw('Invalid User Name and/or Password'));
  }

  register(registerUser:any): Observable<any> {
    this.isAuthenticated = true;
    console.log(registerUser);
    return this.http.post('http://localhost:3000/auth/register',
      JSON.stringify(registerUser),
      options
    )
    .map((resp: Response) => resp.json())
    .catch(this.handleError);
      //this.router.navigate(['/signin']);
      //return Observable.of({}).delay(2000);
  }

  connectWithFacebook() :Observable<any> {
    this.isAuthenticated = true;
    //return Observable.of({}).delay(2000);
    return this.http.get('http://localhost:3000/auth/facebook')
    .map((resp: Response) => resp.json())
    .catch(this.handleError);
  }

  connectWithGoogle() :Observable<any> {
    this.isAuthenticated = true;
    //return Observable.of({}).delay(2000);
    return this.http.get('http://localhost:3000/auth/google')
    .map((resp: Response) => resp.json())
    .catch(this.handleError);
  }

  handleError(error: any) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  logOut(): Observable<any>{
    this.isAuthenticated = false;
    this.currentUser = null;
    this.router.navigate(['/login']);
    return Observable.of({})
  }

}
