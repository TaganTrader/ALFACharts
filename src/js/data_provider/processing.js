'use strict';

class Processing
{
    constructor (dataProvider, chart) {
        this.dataProvider = dataProvider;
        this.chart = chart;
    }

    unrecognized (data) {

    }

    lastPrice(params) {
        let price = params.price;
        let timestamp = Math.floor(new Date(params.timestamp).getTime() / 1000 / 60) * 60;
        
        let lastPrice = this.dataProvider.data[0].close;

        if (this.dataProvider.data.length < 1) return;
        
        //console.log(Math.floor(this.dataProvider.data[0].timestamp, timestamp, new Date(timestamp).getTime() / 1000 / 60) * 60)
        if (this.dataProvider.data[0].timestamp === timestamp) {            
            this.dataProvider.data[0].close = price;
            this.dataProvider.data[0].high = Math.max(this.dataProvider.data[0].high, price);
            this.dataProvider.data[0].low = Math.min(this.dataProvider.data[0].low, price);
            if (lastPrice !== price)
                this.chart.layer.draw();            
        }

        if (this.dataProvider.data[0].timestamp + 60 === timestamp) {
            this.dataProvider.data.unshift({
                timestamp: timestamp,
                close: price,
                open: price,
                high: price,
                low: price,
            });
            this.dataProvider.update();            
            this.chart.layer.draw();
        }        
        
    }

    candles (data) {
        console.log(data)
    }
}

export default Processing;