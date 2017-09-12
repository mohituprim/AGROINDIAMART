import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AuthGuard } from "../../services/authentication/auth-guard.service";
import { ProductComponent } from "app/modules/shoppingcart/product/product.component";
import { ProductDetailComponent } from "app/modules/shoppingcart/product-detail/product-detail.component";

const shoppingRoutes: Routes = [
  {
    path: 'product',
    children: [
      {
        path: '',
        component: ProductComponent,
      },
      {
        path: 'detail',
        component: ProductDetailComponent,
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      shoppingRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class ShoppingCartRoutingModule {}
