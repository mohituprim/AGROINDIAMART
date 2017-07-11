import { Component, OnInit, Input } from '@angular/core';
import {trigger, transition, style, animate, query, stagger} from '@angular/animations';


@Component({
  selector: 'fw-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
  animations: [
    trigger('listAnimation', [
       //...
    ])
  ]
})
export class SideNavComponent implements OnInit {

  marketListHeader="Buy/Sell";
  marketHeaderIcon="shopping_cart";
  marketItemList = ['Agriculture Product','Machinary','Fertilizer','Agriculture Land','Spare-Parts'];

  servicesListHeader="Services";
  servicesHeaderIcon="settings";
  servicesItemList = ['Transportation','WareHousing','Financing','Machine-Repairing','Consulting'];

  constructor() { }

  ngOnInit() {
    this.toggleMarketTab();
    this.toggleServiceTab();
  }
  marketItems = [];

  showMarketItems() {
    this.marketItems = this.marketItemList;
  }

  hideMarketItems() {
    this.marketItems = [];
  }

  toggleMarketTab() {
    this.marketItems.length ? this.hideMarketItems() : this.showMarketItems();
  }
  servicesItems = [];

  showServicesItems() {
    this.servicesItems = this.servicesItemList;
  }

  hideServicesItems() {
    this.servicesItems = [];
  }

  toggleServiceTab() {
    this.servicesItems.length ? this.hideServicesItems() : this.showServicesItems();
  }
}
trigger('listAnimation', [
  transition('* => *', [ // each time the binding value changes
    query(':leave', [
      stagger(100, [
        animate('0.5s', style({ opacity: 0 }))
      ])
    ]),
    query(':enter', [
      style({ opacity: 0 }),
      stagger(100, [
        animate('0.5s', style({ opacity: 1 }))
      ])
    ])
  ])
])
