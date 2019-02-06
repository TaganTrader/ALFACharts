"use strict";

import Axe from './axe'

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
            if (gran >= seg) {
                return prev_gran;
            }
            prev_gran = gran;
            gran = nextGran(gran, i);
        }
        return 1000;
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

        
        let div = this.getPriceScale(price_from, price_to, h / 2, this.layer.touchMode?80:50);
    
        price_to = Math.ceil(price_to / div) * div;
        price_from = Math.floor(price_from / div) * div;

        let iter = 0;

        let max_width = Math.max(ctx.measureText(price_from.toFixed(1)).width, ctx.measureText(price_to.toFixed(1)).width, 46);
        
        max_width = Math.ceil(max_width / 2) * 2

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
        this.layer.price_axe_width = max_width + 8;
        
    }

}

export default PriceAxe