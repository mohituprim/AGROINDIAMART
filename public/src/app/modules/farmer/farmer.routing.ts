import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AuthGuard } from "../../services/authentication/auth-guard.service";

import { HomeComponent } from "app/components/home/home.component";
import { FarmerComponent } from "app/modules/farmer/farmer.component";
import { FarmerOrderComponent } from "app/modules/farmer/order/farmer-order.component";
import { FarmerProfileComponent } from "app/modules/farmer/profile/farmer-profile.component";

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
              { path: 'order', component: FarmerOrderComponent },
            ]
      },
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
