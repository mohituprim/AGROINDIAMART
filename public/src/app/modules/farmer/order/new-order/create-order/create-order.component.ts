import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { IFarmerSellOrder } from "app/shared/interfaces/IFarmer";

import { FarmerService } from "app/services/farmer/farmer.service";

@Component({
  selector: 'create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {

  errorMessage: string;
  subCategory = ['Alovera','Bajra'];
  variety = ['Others','abc'];
  type = ['Organic','Inorganic'];
  units = ['Kg','Ton'];
  title='';
  newSellOrder: IFarmerSellOrder;
  constructor(
    private farmerService: FarmerService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() :void {
    //Intialize the sell order
    this.farmerService.getSellOrder(0)
                .subscribe(order => this.newSellOrder = order,
                           error => this.errorMessage = <any>error);
    //reintialize the title
    this.route.params.subscribe(
      params => {
        let category:string = params['category'];
        this.setTitleAndCategory(category);
        //reintialize the subcategory list
      }
    );
  }

  OnReset(){
    this.ngOnInit();
  }

  setTitleAndCategory(category:string)
  {
  this.newSellOrder.productCategory=category;
  switch(category) {
    case 'crop': {
      this.title = 'Add Crop Commodities'
      break;
    }
    case 'finished': {
        this.title = 'Add Finished Commodities'
        break;
    }
    case 'ffv': {
      this.title = 'Add Fruits/Flowers/Vegetables Commodities'
      break;
    }
    case 'aqua': {
        this.title = 'Add Fisheries and Aqua Commodities'
        break;
    }
    case 'others': {
      this.title = 'Add Handicrafts, Khadi and Others Commodities'
      break;
    }
    case 'cattle': {
        this.title = 'Add LiveStock/Cattle Order'
        break;
    }
    case 'farm': {
      this.title = 'Add Farm Equipments Order'
      break;
    }
    case 'land': {
        this.title = 'Add Land/ Garden Order'
        break;
    }
    case 'machine': {
      this.title = 'Add Machine-Repairing Order'
      break;
    }
    case 'seeds': {
        this.title = 'Add Seeds/Seedlings Commodities'
        break;
    }
  }
  }

  OnAddNewOrder(){
    this.farmerService.saveSellOrder(this.newSellOrder)
        .subscribe((response:IFarmerSellOrder[]) => {
            this.router.navigate(['/farmer/order/sell']);
          },
          (err)=> {
            console.log('got error: ', err);
          }
        );
  }

  getVariety(category:string, subCategory:string){

  }
}
