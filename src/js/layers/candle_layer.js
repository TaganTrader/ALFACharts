"use strict";

import Layer from './layer'
import PriceAxe from '../axis/price_axe'
import TimeAxe from '../axis/time_axe'
import Orders from '../trading/orders';

const default_config = {
    frameWidth: 12,
    frameHeight: 8,
    frameMarginX: 1,
    frameMarginY: 0,
    maxFrameHeight: 2000,
    autosize: true,
}

class CandleLayer {

    constructor (parent, config) {
        config = _.extend({}, default_config, config);
        this.config = config;
        //super(parent, config);
        this.parent = parent;
        this.dataProvider = parent.dataProvider;
        this.tick = this.dataProvider.tick;
        
        this.layer = new Layer(parent, config)
        this.axis = {
            price_axe: new PriceAxe(this),
            time_axe:  new TimeAxe(this)
        }

        this.layer.now = this.dataProvider.data[0].close;

        this.autosize = this.config.autosize;
        if (this.autosize)
            this.autosize_layer();


        this.orders = new Orders(this, this.dataProvider.orders);        

    }

    extremums (from, count) {
        let data = this.dataProvider.data;
        if (from < 0) {
            count += from;
            from = 0;
        }
        if (from > data.length - 1) from = data.length - 1;
        let min = data[from].low;
        let max = data[from].high;

       

        for (let i = from + 1; i < from + count && i < data.length; i++) {
            min = Math.min(data[i].low, min);
            max = Math.max(data[i].high, max);
        }

        return { min, max }
    }

    autosize_layer() {
        let chart = this.parent;
        let framesAmount = Math.floor(chart.offsetWidth / this.layer.frameWidth);
        
        let extremums = this.extremums(Math.round(this.layer.scrollX / this.layer.frameWidth), framesAmount);
        
        let price_height = extremums.max - extremums.min;
        this.layer.now = (extremums.max + extremums.min) / 2;

        this.layer.frameHeight = chart.offsetHeight / 1.15 / (price_height/this.tick);
    }

    priceToCoords (price) {
        var frameHeight = this.layer.frameHeight;
        let now = this.layer.now;
        let diff = (now - price) / this.tick * frameHeight;
        return this.parent.offsetHeight / 2 + diff;
    }

    draw_candles (ctx, theme) {
        let chart = this.parent;
        let data = this.dataProvider.data;
        let tick = this.layer.tick;

        let scrollX = this.layer.scrollX;
        let scrollY = this.layer.scrollY;
    
        let w = this.parent.offsetWidth;
        let h = this.parent.offsetHeight;
        let frameWidth = this.layer.frameWidth;
        let frameHeight = this.layer.frameHeight;

        ctx.setLineDash([0]);

        let last_zero = 0;
        

        for (let i = 0; i < data.length; i++) {
            let open = Math.round(this.priceToCoords(data[i].open) + scrollY);
            let close = Math.round(this.priceToCoords(data[i].close) + scrollY);            
            let high = Math.round(this.priceToCoords(data[i].high) + scrollY);
            let low = Math.round(this.priceToCoords(data[i].low) + scrollY);            

            let candle_width = Math.round(Math.max(frameWidth - this.layer.frameMarginX - 2, 1) / 2) * 2 + 1;

            let x = Math.round(w - ((frameWidth - this.layer.frameMarginX) / 2) + scrollX - 1 - i * frameWidth);            

            if (x < -frameWidth) continue;
            if (x > chart.offsetWidth + frameWidth) continue;
            
            let y = Math.min(open, close);
            let height = Math.max(open, close) - y;

            if (y < -(low - high)) continue;
            if (y > chart.offsetHeight + (low - high)) continue;

            let color;            
            if (data[i].close >= data[i].open) {
                color = theme.colors.candles.bull.body;                
            } else {
                color = theme.colors.candles.bear.body;                
            }            

            ctx.fillStyle = color;
            ctx.beginPath();            
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;

            ctx.moveTo(x - .5, high);
            ctx.lineTo(x - .5, low);
            ctx.stroke();

            ctx.fillRect(
                Math.round(x - candle_width / 2) - 1, 
                y,
                Math.round(candle_width),
                height + 1);
        }        

        // Рисуем линию цены
        if (data.length > 0) {
            let y = scrollY + this.priceToCoords(data[0].close);
                        
            let color = "";            
            if (data[0].close >= data[0].open) {
                color = theme.colors.candles.bull.price_line;                
            } else {
                color = theme.colors.candles.bear.price_line;       
            }

            ctx.beginPath();
            ctx.setLineDash([1, 1]);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;

            ctx.moveTo(0, Math.round(y) + .5);
            ctx.lineTo(w, Math.round(y) + .5);
            ctx.stroke();
            
            ctx.fillStyle = color;
            ctx.fillRect(w, y - 10, -this.layer.price_axe_width, 20);

            ctx.textAlign = "center"; 
            ctx.textBaseline = "middle";
            ctx.font = '12px "EXO 2"';
            if (data[0].close >= data[0].open)  
                ctx.fillStyle = theme.colors.candles.bull.price_text;
            else
                ctx.fillStyle = theme.colors.candles.bear.price_text;
            let text = data[0].close.toFixed(1);
            ctx.fillText(text, w - this.layer.price_axe_width / 2, y);
        }
        
    }

    draw () {
        this.parent._resize();
        
        this.width = this.parent.offsetWidth;
        this.height = this.parent.offsetHeight;

        if (this.autosize) {
            this.autosize_layer()
            this.layer.scrollY = 0;
        }
            
        var c = this.parent.linen;
        var ctx = c.getContext("2d");        
        ctx.font = '14px "EXO 2"';
    
        ctx.fillStyle = this.parent.theme.colors.workarea_bg;
        ctx.fillRect(0, 0, c.width, c.height);

        let theme = this.parent.theme;
        this.axis.price_axe.draw(ctx, theme);
        this.draw_candles(ctx, theme);
        this.orders.draw(ctx, theme);
        this.parent.crosshair.draw(ctx, this.layer, theme);
    }

}

export default CandleLayer