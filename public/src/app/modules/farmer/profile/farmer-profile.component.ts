import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-farmer-profile',
  templateUrl: './farmer-profile.component.html',
  styleUrls: ['./farmer-profile.component.css']
})
export class FarmerProfileComponent implements OnInit {
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
