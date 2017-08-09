import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { FarmerService } from "app/services/farmer/farmer.service";


@Injectable()
export class FarmerSellOrderResolver implements Resolve<any> {

    constructor(private farmerService: FarmerService,
                private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.farmerService.getSellOrders()
            .map(response => {
                let orders = response['orders']['sellorders'];
                if (orders) {
                    return orders;
                }
                console.log(`NO Orders`);
                this.router.navigate(['/farmer/order/sell']);
                return null;
            })
            .catch(error => {
                console.log(`Retrieval error: ${error}`);
                this.router.navigate(['/farmer/order/sell']);
                return Observable.of(null);
            });
    }
}