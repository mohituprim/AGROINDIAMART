import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AuthGuard } from "../../services/authentication/auth-guard.service";

import { HomeComponent } from "app/components/home/home.component";
import { FarmerComponent } from "app/modules/farmer/farmer.component";
import { FarmerOrderComponent } from "app/modules/farmer/order/farmer-order.component";
import { FarmerProfileComponent } from "app/modules/farmer/profile/farmer-profile.component";
import { OrderServicesComponent } from "app/modules/farmer/order/services/order-services.component";
import { OrderRentComponent } from "app/modules/farmer/order/rent/order-rent.component";
import { OrderSellComponent } from "app/modules/farmer/order/sell/order-sell.component";
import { OrderBuyComponent } from "app/modules/farmer/order/buy/order-buy.component";
import { NewOrderComponent } from "app/modules/farmer/order/new-order/new-order.component";
import { CreateOrderComponent } from "app/modules/farmer/order/new-order/create-order/create-order.component";
import { FarmerSellOrderResolver } from "app/services/farmer/farmer-sellorder.resolver.service";

const farmerRoutes: Routes = [
  {
    path: 'farmer',
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        component: FarmerComponent,
        children: [
              { path: '', redirectTo: 'profile', pathMatch: 'full' },
              { path: 'profile', component: FarmerProfileComponent },
            ]
      },
      {
        path: 'order',
        component: FarmerComponent,
        children: [
              { path: '', redirectTo: 'buy', pathMatch: 'full' },
              { path: 'buy', component: OrderBuyComponent },
              { path: 'sell', component: OrderSellComponent, resolve: { orders: FarmerSellOrderResolver } },
              { path: 'rent', component: OrderRentComponent },
              { path: 'services', component: OrderServicesComponent },
            ]
      },
      {
        path: 'neworder',
        component: NewOrderComponent,
        children: [
              { path: '', redirectTo: 'create/crop', pathMatch: 'full' },
              { path: 'create/:category', component: CreateOrderComponent },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      farmerRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class FarmerRoutingModule {}
