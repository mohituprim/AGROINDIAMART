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

//Component
import { FrameworkBodyComponent } from "./framework-body/framework-body.component";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { MainContentComponent } from "./main-content/main-content.component";
import { LogInComponent } from "../authentication/login/login.component";
import { RegisterComponent } from "../authentication/register/register.component";
import { AuthenticationComponent } from "../authentication/authentication.component";
import { ToolBarComponent } from "./tool-bar/tool-bar.component";
import { VerticalMenuComponent } from "./vertical-menu/vertical-menu.component";
import { MobileSidenavComponent } from "./mobile-sidenav/mobile-sidenav.component";

//Services
import { AuthenticationModule } from "app/modules/authentication/authentication.module";
import { AuthenticationService } from "app/services/authentication/auth.service";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule
  ],
  declarations: [
    FrameworkBodyComponent,
    ToolBarComponent,
    SideNavComponent,
    MainContentComponent,
    AuthenticationComponent,
    LogInComponent,
    RegisterComponent,
    VerticalMenuComponent,
    MobileSidenavComponent,
    //Custom Module

  ],
  providers:[
    AuthenticationService
  ],
  exports:[
    FrameworkBodyComponent,
    VerticalMenuComponent
  ],
  entryComponents: [
    AuthenticationComponent
  ]
})
export class FrameworkModule { }
