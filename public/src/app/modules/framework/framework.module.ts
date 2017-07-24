// Libraries
import { NgModule  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

//Services
import { AuthenticationModule } from "app/modules/authentication/authentication.module";
import { AuthenticationService } from "app/services/authentication/auth.service";

//Component
import { FrameworkBodyComponent } from "./framework-body/framework-body.component";
import { LogInComponent } from "../authentication/login/login.component";
import { RegisterComponent } from "../authentication/register/register.component";
import { AuthenticationComponent } from "../authentication/authentication.component";
import { ToolBarComponent } from "./tool-bar/tool-bar.component";
import { VerticalMenuComponent } from "./vertical-menu/vertical-menu.component";
import { EmptyOrderCartComponent } from "app/modules/framework/empty-order-cart/empty-order-cart.component";
import { SubMenuComponent } from "app/modules/framework/vertical-menu/sub-menu.component";
import { StaticSidenavComponent } from "app/modules/framework/static-sidenav/static-sidenav.component";
import { DropDownSideNavComponent } from "app/modules/framework/dropdown-side-nav/dropdown-side-nav.component";
import { FrameworkTableComponent } from "app/modules/framework/framework-table/framework-table.component";
import { CdkTableModule } from "@angular/cdk";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    CdkTableModule,
    FlexLayoutModule,
    BrowserAnimationsModule
  ],
  declarations: [
    FrameworkBodyComponent,
    ToolBarComponent,
    DropDownSideNavComponent,
    AuthenticationComponent,
    LogInComponent,
    RegisterComponent,
    VerticalMenuComponent,
    SubMenuComponent,
    StaticSidenavComponent,
    EmptyOrderCartComponent,
    FrameworkTableComponent
    //Custom Module

  ],
  providers:[
    AuthenticationService
  ],
  exports:[
    FrameworkBodyComponent,
    VerticalMenuComponent,
    EmptyOrderCartComponent,
    StaticSidenavComponent,
    FrameworkTableComponent
  ],
  entryComponents: [
    AuthenticationComponent
  ]
})
export class FrameworkModule { }
