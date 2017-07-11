import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { AuthenticationApi } from "../authentication-api";
import { AuthenticationComponent } from "../authentication.component";

@Component({
  selector: 'fw-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  ngOnInit(): void {
  }

  formError: string;
  submitting = false;
  Roles=[
    {name:"Farmer"},
    {name:"Transporter"},
    {name:"WareHouse Owner"},
    {name:"Service Provider"},
    {name:"Advisor"},
    {name:"Agriculutre Institute"},
    {name:"Individual Seller/Buyer"}];
  constructor(
    private authApi: AuthenticationApi,
    private router:Router,
    private authComp:AuthenticationComponent
  ) { }

  onSubmit(registerForm: NgForm) {

    if (registerForm.valid) {

      console.log('submitting...', registerForm.value);
      this.submitting = true;
      this.formError = null;
      this.authApi.register(registerForm.value)
        .subscribe((data) => {
            console.log('got valid: ', data);
            //this.onDClose.emit(true);
            this.authComp.onClose(true);
            this.router.navigate(['/authenticated']);
          },
          (err)=> {
            this.submitting = false;
            console.log('got error: ', err);
            this.formError = err;
          }
        );
    }
  }
}
