const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    SellOrder = require('../../models/farmer/sell/order');

class FarmersRepository {

    // save the sell order
    saveSellOrder(body, callback) {
        var sellOrder = new SellOrder();
        sellOrder.productCategory = body.productCategory;
        sellOrder.productSubCategory = body.productSubCategory;
        sellOrder.productType = body.productType;
        sellOrder.productUnitType = body.productUnitType;
        sellOrder.variety = body.variety;
        sellOrder.noOfUnit = body.noOfUnit;
        sellOrder.description = body.description;
        sellOrder.ratePerUnit = body.ratePerUnit;
        sellOrder.imageUrl = "body.imageUrl";
        sellOrder.customerAddress = "body.customerAddress";
        sellOrder.orderDate = body.orderDate;

        sellOrder.save((err, sellOrder) => {
            if (err) {
                console.log(`*** sellOrder repo insert error: ${err}`);
                return callback(err, null);
            }
            callback(null, sellOrder);
        });
    }

    // get all the orders
    getSellOrders(callback) {
        console.log('*** FarmersRepository.getSellOrders');
        SellOrder.count((err, ordersCount) => {
            var count = ordersCount;
            console.log(`SellOrder count: ${count}`);

            SellOrder.find({}, (err, sellorders) => {
                if (err) { 
                    console.log(`*** SellOrder find error: ${err}`); 
                    return callback(err); 
                }
                callback(null, {
                    count: count,
                    sellorders: sellorders
                });
            });

        });
    }
}
module.exports = new FarmersRepository();