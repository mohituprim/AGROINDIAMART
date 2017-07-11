import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AuthGuard } from "./services/authentication/auth-guard.service";
import { HomeComponent } from "app/components/home/home.component";
import { PageNotFoundComponent } from "app/components/common/page-not-found.component";
import { DefaultContentComponent } from "app/components/default-content/default-content.component";
// import { FarmerComponent } from "app/modules/farmer/farmer.component";

const appRoutes: Routes = [
  { path: 'login', component: DefaultContentComponent },
  { path: 'register', component: DefaultContentComponent },
  { path: '', component: DefaultContentComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
