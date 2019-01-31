"use strict";


class DataProvider {

    constructor () {
        this.tick = 0.05;

        this.orders = [
            {
                orderQty: 30000,
                price: 4028.5,
                side: "Buy"
            },
            {
                orderQty: 70000,
                price: 4020,
                side: "Buy"
            },

            {
                orderQty: 30000,
                price: 4037.5,
                side: "Sell"
            },
            {
                orderQty: 70000,
                price: 4050,
                side: "Sell"
            }
        ];
        

        this.data = [];             
    }    

}

export default DataProvider