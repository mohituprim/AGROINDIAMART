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
      subMenuItem:[{name:'Buy'},{name:'Sell'},{name:'Services'}],
       icon:'add_box'
    },
    {name:'Messages and Notifications',
      link:'',
      subMenuItem:[{name:'My Chats'},{name:'Alerts'},{name:'My Offers'}],
      icon:'email'
    },
    {name:'My Ads',link:'/farmer/profile', icon:'event_note'},
    {name:'My Product',link:'/farmer/profile', icon:'view_list'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
