//Libraries
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from "@angular/router";
import { MaterialModule, MdNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlexLayoutModule } from '@angular/flex-layout';
import { CarouselModule } from 'angular4-carousel';
import 'hammerjs';

//Routes
import { AppRoutingModule } from "app/app.routing";

//Services
import { AuthGuard } from "./services/authentication/auth-guard.service";
import { AuthenticationService } from "app/services/authentication/auth.service";
import { AuthenticationApi } from "app/modules/authentication/authentication-api";

//Modules
import { FrameworkModule } from "app/modules/framework/framework.module";
import {  FarmerModule } from "./modules/farmer/farmer.module";
import { ShoppingCartModule } from "app/modules/shoppingcart/shoppingcart.module";

//Component
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from "app/components/common/page-not-found.component";
import { DefaultContentComponent } from './components/default-content/default-content.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    DefaultContentComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
    MdNativeDateModule,
    CarouselModule,
    //Custom Module
    FrameworkModule,
    ShoppingCartModule,
    FarmerModule,

    //The order of route configuration matters.
    AppRoutingModule
  ],
  exports: [
  ],
  providers: [
    AuthenticationService,//equivalent to ---{provide: UserApi, useClass: UserService }
    { provide: AuthenticationApi, useExisting: AuthenticationService },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
