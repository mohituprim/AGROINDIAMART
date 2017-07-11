import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import { AuthenticationApi } from "./authentication-api";
import { Router } from "@angular/router";

@Component({
  selector: 'fw-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent {
  constructor(
    public dialogRef: MdDialogRef<AuthenticationComponent>,
    private authApi: AuthenticationApi,
    private router:Router,
  ) {}
  onClose(v:boolean){
    console.log('closing');
    this.dialogRef.close(true);
  }
  onClick(connectWith:string){
    console.log('connecting:'+connectWith);
    if(connectWith.match('facebook'))
    {
      this.authApi.connectWithFacebook()
        .subscribe((data) => {
            console.log('got valid facebook: ', data);
            this.dialogRef.close(true);
            this.router.navigate(['/authenticated']);
          },
          (err)=> {
            console.log('got error: ', err);
          }
        );
    }
    else if(connectWith.match('google'))
    {
      this.authApi.connectWithGoogle()
        .subscribe((data) => {
            console.log('got valid google: ', data);
            this.dialogRef.close(true);
            this.router.navigate(['/authenticated']);
          },
          (err)=> {
            console.log('got error: ', err);
          }
        );
    }
  }
}
