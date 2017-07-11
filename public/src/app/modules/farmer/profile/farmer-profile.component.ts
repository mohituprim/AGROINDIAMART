import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-farmer-profile',
  templateUrl: './farmer-profile.component.html',
  styleUrls: ['./farmer-profile.component.css']
})
export class FarmerProfileComponent implements OnInit {
  menuHeader="Account";
  headerIcon="home";
  items = ['My Account','My Ads','Message and Notification','Order and Payment','Ad Credit Detail'];
  showProfilePreview=true;
  states=[{code:'1',name:'UttarPradesh'},{code:'2',name:'Delhi'},{code:'3',name:'MadhyaPradesh'}]
  constructor() { }

  myState='';
  ngOnInit() {
    this.myState=this.states[0].code
  }
  OnProfileEdit(){
    this.showProfilePreview=false;
  }
  OnCancel(){
    this.showProfilePreview=true;
  }
}
