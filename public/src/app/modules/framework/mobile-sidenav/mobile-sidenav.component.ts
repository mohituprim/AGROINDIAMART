import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fw-mobile-sidenav',
  templateUrl: './mobile-sidenav.component.html',
  styleUrls: ['./mobile-sidenav.component.css']
})
export class MobileSidenavComponent implements OnInit {

  marketListHeader="Buy/Sell";
  marketHeaderIcon="shopping_cart";
  marketItemList = ['Agriculture Product','Machinary','Fertilizer','Agriculture Land','Spare-Parts'];

  servicesListHeader="Services";
  servicesHeaderIcon="settings";
  servicesItemList = ['Transportation','WareHousing','Financing','Machine-Repairing','Consulting'];

  constructor() { }

  ngOnInit() {
  }

}
