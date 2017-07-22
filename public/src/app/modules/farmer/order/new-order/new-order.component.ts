import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

    produceItem = [
    {name:'Sell Crop Product',
      link:'',
      subMenuItem:[
                    {name:'Crop Commodities', link:'/farmer/neworder/create/crop'},
                    {name:'Finished Commodities', link:'/farmer/neworder/create/finished'},
                    {name:'Fruits/Flowers/Vegetables', link:'/farmer/neworder/create/ffv'},
                    {name:'Fisheries and Aqua', link:'/farmer/neworder/create/aqua'},
                    {name:'Handicrafts, Khadi and Others', link:'/farmer/neworder/create/others'}
                  ],
       icon:'shopping_cart'
    },
    {name:'Sell Other Product ',
      link:'',
      subMenuItem:[
                    {name:'LiveStock/Cattle', link:'/farmer/neworder/create/cattle'},
                    {name:'Farm Equipments', link:'/farmer/neworder/create/farm'},
                    {name:'Land/ Garden', link:'/farmer/neworder/create/land'},
                    {name:'Machine-Repairing', link:'/farmer/neworder/create/machine'},
                    {name:'Seeds/Seedlings', link:'/farmer/neworder/create/seeds'}
                  ],
      icon:'settings'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
