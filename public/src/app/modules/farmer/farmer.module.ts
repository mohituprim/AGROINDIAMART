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
import { AuthenticationApi } from "../authentication/authentication-api";

//Modules
import { FrameworkModule } from "../framework/framework.module";

//Component
import { FarmerComponent } from './farmer.component';
import { FarmerOrderComponent } from "app/modules/farmer/order/farmer-order.component";
import { FarmerProfileComponent } from "app/modules/farmer/profile/farmer-profile.component";
import { FarmerRoutingModule } from "app/modules/farmer/farmer.routing";

@NgModule({
  declarations: [
    FarmerComponent,
    FarmerOrderComponent,
    FarmerProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    FrameworkModule,
    MaterialModule,
    MdNativeDateModule,
    FarmerRoutingModule
  ],
  exports:[
    FarmerComponent,
  ],
  providers: [
    AuthenticationService,//equivalent to ---{provide: UserApi, useClass: UserService }
    { provide: AuthenticationApi, useExisting: AuthenticationService },
    AuthGuard
  ]
})
export class FarmerModule { }
