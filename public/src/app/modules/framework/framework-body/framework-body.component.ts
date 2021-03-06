import { Component, OnInit} from '@angular/core';
import { AuthenticationService } from "app/services/authentication/auth.service";

@Component({
  selector: 'fw-framework-body',
  templateUrl: './framework-body.component.html',
  styleUrls: ['./framework-body.component.css']
})
export class FrameworkBodyComponent implements OnInit {
  constructor(private authService:AuthenticationService ){ }

  items = [
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
  ngOnInit() {

  }
}
