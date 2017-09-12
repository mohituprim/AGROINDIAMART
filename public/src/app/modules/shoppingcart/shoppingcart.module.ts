// Libraries
import { NgModule  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkTableModule } from "@angular/cdk";
import 'hammerjs';

//modules
import { ShoppingCartRoutingModule } from "app/modules/shoppingcart/shoppingcart.routing";

//Services
import { AuthenticationModule } from "app/modules/authentication/authentication.module";
import { AuthenticationService } from "app/services/authentication/auth.service";

//Component
import { ShoppingPageComponent } from "app/modules/shoppingcart/shopping-page/shopping-page.component";
import { ProductDetailComponent } from "app/modules/shoppingcart/product-detail/product-detail.component";
import { ProductComponent } from "app/modules/shoppingcart/product/product.component";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    CdkTableModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    ShoppingCartRoutingModule
  ],
  declarations: [
    //Custom Module
    ShoppingPageComponent,
    ProductComponent,
    ProductDetailComponent,
  ],
  providers:[
    AuthenticationService
  ],
  exports:[
    ShoppingPageComponent
  ],
  entryComponents: [
  ]
})
export class ShoppingCartModule { }
