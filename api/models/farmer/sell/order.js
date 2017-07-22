const mongoose = require('mongoose'),
      Schema = mongoose.Schema

const SellOrderSchema = new Schema({
  productCategory  : { type : String, required: true, trim: true },
  productSubCategory  : { type : String, required: true, trim: true },
  productType  : { type : String, required: true, trim: true },
  productUnitType  : { type : String, required: true, trim: true },
  variety  : { type : String, required: true, trim: true },
  noOfUnit    : { type : Number },
  description  : { type : String, required: true, trim: true },
  ratePerUnit : { type : Number },
  imageUrl  : { type : String, required: true, trim: true },
  customerAddress  : { type : String, required: true, trim: true },
  orderDate  : { type : String, required: true, trim: true }
});

module.exports = mongoose.model('FarmerSellOrder', SellOrderSchema);