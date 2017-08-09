/* Defines the product entity */
export interface IFarmerSellOrder {
    id: number;
    productCode:string;
    productCategory: string;
    productSubCategory: string;
    productType: string;
    productUnitType: string;
    variety: string;
    noOfUnit: number;
    description: string;
    ratePerUnit: number;
    imageUrl: string;
    customerAddress: string;
    orderDate: string;
}