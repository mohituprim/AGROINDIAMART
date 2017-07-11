//Libraries
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from "@angular/router";
import { MaterialModule, MdNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

//Services
import { AuthGuard } from "../../services/authentication/auth-guard.service";
import { AuthenticationService } from "app/services/authentication/auth.service";
import { AuthenticationApi } from "./authentication-api";

//Component
import { LogInComponent } from "app/modules/authentication/login/login.component";
import { RegisterComponent } from "app/modules/authentication/register/register.component";
import { AuthenticationComponent } from "app/modules/authentication/authentication.component";

@NgModule({
  declarations: [
    LogInComponent,
    RegisterComponent,
    AuthenticationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  exports:[
    AuthenticationComponent
  ],
  providers: [
    AuthenticationService,//equivalent to ---{provide: UserApi, useClass: UserService }
    { provide: AuthenticationApi, useExisting: AuthenticationService },
    AuthGuard
  ]
})
export class AuthenticationModule { }
