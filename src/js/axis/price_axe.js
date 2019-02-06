"use strict";

import Axe from './axe'

import moment from "moment";
moment.locale('ru-RU');

class PriceAxe extends Axe {

    constructor (parent) {
        super(parent);
        this.parent = parent;
        this.layer = parent.layer;
    }

    getPriceScale (min, max, pixel_height, pixel_spacing) {
        let range = max - min;
        let divisions = pixel_height / pixel_spacing; 
        let seg = range / divisions;
        let gran = 0.00001;
        let prev_gran = 0.000005;
        let gran_factors = [2, 2.5, 2];
        let nextGran = function nextGran(current_value, i) {
            return current_value * gran_factors[i % 3];
        }
        for (let i = 0;; i++) {
            if (i > 10000) return 1000;
            if (gran >= seg) {
                return prev_gran;
            }
            prev_gran = gran;
            gran = nextGran(gran, i);
        }
        return 1000;
    }

    getTimeScale (min, max, pixel_height, pixel_spacing) {
        let range = max - min;
        let divisions = pixel_height / pixel_spacing; 
        let seg = range / divisions;
        let gran = 0.00001;
        let prev_gran = 0.000005;
        let gran_factors = [2.5, 2, 2];
        let nextGran = function nextGran(current_value, i) {
            return current_value * gran_factors[i % 3];
        }
        for (let i = 0;; i++) {
            if (i > 10000) return 1000;
            if (gran >= seg) {
                return prev_gran;
            }
            prev_gran = gran;
            gran = nextGran(gran, i);
        }
        return 1000;
    }

    candleIDToX(candleID) {
        let chart = this.parent.parent;
        let frameWidth = this.layer.frameWidth;
        let data = this.parent.dataProvider.data;
        
        let offset = (data[0].timestamp - candleID ) / 60;        
        return chart.offsetWidth - offset * frameWidth - frameWidth/2 - 1;
    }

    draw (ctx, theme) {
        let scrollX = this.layer.scrollX;
        let scrollY = this.layer.scrollY;

        let frameWidth = this.layer.frameWidth;
        let frameHeight = this.layer.frameHeight;

        let now = this.layer.now;
        let tick = this.layer.tick;

        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";  

        let fontSize = 12;
        if (this.layer.touchMode)
            ctx.font = (fontSize * theme.mobile.font_scale) + 'px "EXO 2"';
        else
            ctx.font = (fontSize) + 'px "EXO 2"';

        ctx.fillStyle = theme.colors.axe_texts;
        ctx.setLineDash([0]);

        let w = this.parent.parent.offsetWidth;
        let h = this.parent.parent.offsetHeight;

        let x = w - 4; 
        let max_h_count = h / frameHeight

        let price_from = Math.round(now / tick) * tick - Math.ceil(max_h_count / 2) * tick + Math.round((scrollY / (frameHeight) * tick) / tick) * tick;
        let price_to = Math.round(now / tick) * tick + (Math.ceil(max_h_count / 2) + 1) * tick + tick + Math.round((scrollY / (frameHeight) * tick) / tick) * tick;
                        

        price_to = now + (h / 2) / (frameHeight) * tick + scrollY / (frameHeight) * tick;
        price_from = now - (h / 2) / (frameHeight) * tick + scrollY / (frameHeight) * tick;

        
        let div = this.getPriceScale(price_from, price_to, h / 2, this.layer.touchMode?70:30);
    
        price_to = Math.ceil(price_to / div) * div;
        price_from = Math.floor(price_from / div) * div;

        let iter = 0;

        let max_width = Math.max(ctx.measureText(price_from.toFixed(1)).width, ctx.measureText(price_to.toFixed(1)).width, 46);
        
        let dec = 5;
        if (this.layer.touchMode)
            dec = Math.round(dec * theme.mobile.font_scale);
        max_width = Math.ceil(max_width / dec) * dec

        for (let p = price_from; p <= price_to; p += div) {
            iter ++;
            if (iter > 100) break;
            let y = Math.round((now - p) / tick * frameHeight + h / 2);                    

            ctx.beginPath();
            ctx.strokeStyle = theme.colors.axe_lines//(this.params.theme&&this.params.theme.axis_lines_color)?this.params.theme.axis_lines_color:'';
            //ctx.strokeStyle = '#FFFFFF'; 
            ctx.lineWidth = 1;
            ctx.moveTo(0, Math.round(scrollY + y) + .5);
            ctx.lineTo(w - 45, Math.round(scrollY + y) + .5);
            ctx.stroke();
            
            

            let text = (p).toFixed(1); 
            
            ctx.fillText(text, x - max_width / 2, scrollY + y, max_width);
        }
        this.layer.price_axe_width = max_width + 4;

        let data = this.parent.dataProvider.data;
        if (data.length > 0) 
        {
            let timefrom = this.parent.dataStartIndexOffset;
            let timeto = this.parent.dataProvider.offset + Math.ceil((w + scrollX) / frameWidth);

            if (timeto > data.length - 1)
                timeto = data.length - 1;

            let timefrom_ts = data[timefrom].timestamp;   
            let timeto_ts = data[timeto].timestamp;
            
            div = this.getTimeScale(timeto_ts / 60, timefrom_ts / 60, w / 2, 80) * 60;            

            timeto_ts = Math.ceil(timeto_ts / div) * div;
            timefrom_ts = Math.floor(timefrom_ts / div) * div;

            //to = Math.ceil(to / div) * div;
            //timefrom = Math.floor(timefrom / div) * div;
            ctx.textAlign = "center"; 
            ctx.textBaseline = "middle";
            for (let t = timeto_ts; t <= timefrom_ts; t += div) {
                iter ++;
                if (iter > 100) break;
                let x = this.candleIDToX(t); // Math.round(p/60 * frameWidth + w / 2);

                ctx.beginPath();
                ctx.strokeStyle = theme.colors.axe_lines//(this.params.theme&&this.params.theme.axis_lines_color)?this.params.theme.axis_lines_color:'';
                //ctx.strokeStyle = '#FFFFFF'; 
                ctx.lineWidth = 1;
                ctx.moveTo(Math.round(scrollX + x) + .5, 0);
                ctx.lineTo(Math.round(scrollX + x) + .5, h);
                ctx.stroke();
                
                

                let text = moment(t * 1000).format("HH:mm");
                ctx.fillText(text, x + scrollX, h - (this.layer.touchMode?15:9), max_width);
            }
        }
        
    }

}

export default PriceAxe