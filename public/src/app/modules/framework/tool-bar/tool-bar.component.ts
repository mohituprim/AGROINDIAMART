import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MdDialog, MdSidenav } from "@angular/material";
import { AuthenticationComponent } from "../../authentication/authentication.component";
import { AuthenticationApi } from "../../authentication/authentication-api";
import { AuthenticationService } from "app/services/authentication/auth.service";

@Component({
  selector: 'fw-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {
  @Output() mobileNavToggle = new EventEmitter<boolean>();

  constructor(
    public dialog: MdDialog,
    private authService:AuthenticationService,
    private authApi: AuthenticationApi
    ) {}

  openLogInRegisterDialog() {
    this.dialog.open(AuthenticationComponent, {
      height: '550px',
      width: '350px'
    });
  }

  logOut() {
    this.authApi.logOut();
  }

  mobileNavOpen() {
    this.mobileNavToggle.emit(true);
  }

  ngOnInit() {
  }

}
