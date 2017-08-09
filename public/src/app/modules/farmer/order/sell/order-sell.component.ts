import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'farmer-order-sell',
  templateUrl: './order-sell.component.html',
  styleUrls: ['./order-sell.component.css']
})
export class OrderSellComponent implements OnInit {

  ordersList:any;
  columnName:any
  constructor(private route: ActivatedRoute) {
    this.columnName=['orderDate','productCategory', 'productType']
   }

  ngOnInit() {
    this.ordersList = this.route.snapshot.data['orders'];
  }

}
