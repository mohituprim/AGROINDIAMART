import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { AuthenticationApi } from "../authentication-api";
import { AuthenticationComponent } from "../authentication.component";

@Component({
  selector: 'fw-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LogInComponent  implements OnInit{

  //@Output() onDClose:EventEmitter<boolean> = new EventEmitter<boolean>();
  formError: string;
  submitting = false;
  constructor(
    private authApi: AuthenticationApi,
    private router:Router,
    private authComp:AuthenticationComponent
  ) { }

  onSubmit(logInForm: NgForm) {

    if (logInForm.valid) {

      console.log('submitting...', logInForm.value);
      this.submitting = true;
      this.formError = null;
      this.authApi.logIn(logInForm.value)
        .subscribe((data) => {
            console.log('got valid: ', data);
            //this.onDClose.emit(true);
            this.authComp.onClose(true);
            this.router.navigate(['/farmer']);
          },
          (err)=> {
            this.submitting = false;
            console.log('got error: ', err);
            this.formError = err;
          }
        );
    }

  }

  ngOnInit() {
  }

}
