import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit {

  menuHeader="Account";
  headerIcon="home";
  items = [
    {name:'My Account',link:'/farmer/profile'},
    {name:'Order & Payment',link:'/farmer/order'},
    {name:'My Account',link:'/farmer/order'},
    {name:'My Account',link:'/farmer/order'},
    {name:'My Account',link:'/farmer/order'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
