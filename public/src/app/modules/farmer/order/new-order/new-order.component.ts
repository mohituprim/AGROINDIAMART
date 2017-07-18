import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

    produceItem = [
    {name:'Buy/Sell',
      link:'',
      subMenuItem:[
                    {name:'Agriculture Product', link:'/farmer/order/buy'},
                    {name:'Machinary', link:'/farmer/order/sell'},
                    {name:'Fertilizer', link:'/farmer/order/services'},
                    {name:'Agriculture Land', link:'/farmer/order/rent'},
                    {name:'Spare-Parts', link:'/farmer/order/rent'}
                  ],
       icon:'shopping_cart'
    },
    {name:'Services',
      link:'',
      subMenuItem:[
                    {name:'Transportation', link:''},
                    {name:'WareHousing', link:''},
                    {name:'Financing', link:''},
                    {name:'Machine-Repairing', link:''},
                    {name:'Consulting', link:''}
                  ],
      icon:'settings'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
