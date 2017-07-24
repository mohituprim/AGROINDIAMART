import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'farmer-order-sell',
  templateUrl: './order-sell.component.html',
  styleUrls: ['./order-sell.component.css']
})
export class OrderSellComponent implements OnInit {

  ordersList:any;
  constructor() {
    this.ordersList=[{id:'1',productCode:'123'}]
   }

  ngOnInit() {
  }

}
