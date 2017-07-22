import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { IFarmerSellOrder } from '../../shared/interfaces/IFarmer';

@Injectable()
export class FarmerService {
    private baseUrl = 'http://localhost:3000/';

    constructor(private http: Http) { }

    //Sell Order operation
    getSellOrders(): Observable<IFarmerSellOrder[]> {
      return this.http.get(this.baseUrl)
          .map(this.extractData)
          .do(data => console.log('getOrders: ' + JSON.stringify(data)))
          .catch(this.handleError);
    }

    getSellOrder(id:Number): Observable<IFarmerSellOrder>{
      if (id === 0) {
        return Observable.of(this.initializeFarmerSellOrder());
      };
      const url = `${this.baseUrl}/${id}`;
      return this.http.get(url)
        .map(this.extractData)
        .do(data => console.log('getProduct: ' + JSON.stringify(data)))
        .catch(this.handleError);
    }

    deleteSellOrder(id: number): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        const url = `${this.baseUrl}/${id}`;
        return this.http.delete(url, options)
            .do(data => console.log('deleteProduct: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    saveSellOrder(order: IFarmerSellOrder){
      var headers = new Headers({ 'Content-Type': 'application/json' });
      var options = new RequestOptions({ headers: headers });
      return this.http.post('http://localhost:3000/farmer/order/sell',
      JSON.stringify(order),
      options
    )
    .map((resp: Response) => resp.json())
    .catch(this.handleError);
      // if (order.id === 0) {
      //     return this.createSellOrder(order, options);
      // }
      // return this.updateSellOrder(order, options);
    }

    private createSellOrder(order: IFarmerSellOrder, options: RequestOptions): Observable<IFarmerSellOrder> {
        order.id = undefined;
        return this.http.post('http://localhost:3000/farmer/order/sell', order, options)
            .map(this.extractData)
            .do(data => console.log('createOrder: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    private updateSellOrder(product: IFarmerSellOrder, options: RequestOptions): Observable<IFarmerSellOrder> {
        const url = `${this.baseUrl}/${product.id}`;
        return this.http.put(url, product, options)
            .map(() => product)
            .do(data => console.log('updateSellOrder: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    initializeFarmerSellOrder(): IFarmerSellOrder {
        // Return an initialized object
        return {
            id: 0,
            productCode: null,
            productCategory: null,
            productSubCategory: null,
            productType: null,
            productUnitType: null,
            variety: null,
            noOfUnit: 0,
            description: null,
            ratePerUnit: 0,
            imageUrl: null,
            customerAddress: null,
            orderDate:null,
        };
    }
    //Get Orders Detail
    getBuyOrder(){}
    getRentOrder(){}
    getServicesRequestOrder(){}

    //Delete Orders
    deleteBuyOrder(){}
    deleteRentOrder(){}
    deleteServicesRequestOrder(){}

    //Save Orders
    saveBuyOrder(){}
    saveRentOrder(){}
    saveServicesRequestOrder(){}

    private extractData(response: Response) {
        let body = response.json();
        return body.data || {};
    }

    private handleError(error: Response): Observable<any> {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
