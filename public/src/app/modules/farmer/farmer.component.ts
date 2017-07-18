import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit {
  items = [
    {name:'My Account',link:'/farmer/profile', icon:'home'},
    {name:'Order & Payment Details',
      link:'',
      subMenuItem:[
                    {name:'Buy', link:'/farmer/order/buy'},
                    {name:'Sell', link:'/farmer/order/sell'},
                    {name:'Services', link:'/farmer/order/services'},
                    {name:'Rent', link:'/farmer/order/rent'}
                  ],
       icon:'add_box'
    },
    {name:'Messages and Notifications',
      link:'',
      subMenuItem:[
                    {name:'My Chats', link:''},
                    {name:'Alerts', link:''},
                    {name:'My Offers', link:''}
                  ],
      icon:'email'
    },
    {name:'My Ads',link:'/farmer/order', icon:'event_note'},
    {name:'My Product',link:'/farmer/profile', icon:'view_list'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
