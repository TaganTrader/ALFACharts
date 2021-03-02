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
        let gran = 0.0000001;
        let prev_gran = 0.00000005;
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
        let gran_factors = [1.5];
        //let gran_factors = [2, 3, 5, 15, 30, 60, 120, 160, 360];
        let gf_length = gran_factors.length;
        let nextGran = function nextGran(current_value, i) {
            return current_value * gran_factors[i % gf_length];
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

        let offset = (data[0].timestamp - candleID) / 60;
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
            ctx.font = (fontSize * theme.mobile.font_scale) + 'px "Open Sans"';
        else
            ctx.font = (fontSize) + 'px "Open Sans"';

        ctx.fillStyle = theme.colors.axe_texts;
        ctx.setLineDash([0]);

        let w = this.parent.parent.offsetWidth;
        let h = this.parent.parent.offsetHeight;

        let x = w;
        let max_h_count = h / frameHeight

        let price_from = Math.round(now / tick) * tick - Math.ceil(max_h_count / 2) * tick + Math.round((scrollY / (frameHeight) * tick) / tick) * tick;
        let price_to = Math.round(now / tick) * tick + (Math.ceil(max_h_count / 2) + 1) * tick + tick + Math.round((scrollY / (frameHeight) * tick) / tick) * tick;


        price_to = now + (h / 2) / (frameHeight) * tick + scrollY / (frameHeight) * tick;
        price_from = now - (h / 2) / (frameHeight) * tick + scrollY / (frameHeight) * tick;


        let div = this.getPriceScale(price_from, price_to, h / 2, this.layer.touchMode?70:30);

        price_to = Math.ceil(price_to / div) * div;
        price_from = Math.floor(price_from / div) * div;

        let iter = 0;

        let max_length = Math.max(price_from.toFixed(this.parent.parent.config.decimals).length, price_to.toFixed(this.parent.parent.config.decimals).length);
        let max_width = Math.max(ctx.measureText('0'.repeat(max_length)).width, 46) + 4 * (this.layer.touchMode?2:1);

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

            let text = (p).toFixed(this.parent.parent.config.decimals);
            ctx.fillText(text, x - max_width / 2, scrollY + y, max_width);
        }
        this.layer.price_axe_width = max_width;

        let data = this.parent.dataProvider.data;
        let data_offset = this.parent.dataProvider.offset;
        let curr_timeframe = this.parent.dataProvider.timeframe;

        if (data.length > 0)
        {
            let timefrom = this.parent.dataStartIndexOffset;
            let timeto = this.parent.dataProvider.offset + Math.ceil((w + scrollX) / frameWidth);

            if (timeto > data.length - 1)
                timeto = data.length - 1;

            if (timeto < 0)
                timeto = 0;

            let need_candle = Math.ceil((scrollX + max_width) / frameWidth);
            let zero_timestamp = data[data_offset].timestamp;

            //console.log(moment(zero_timestamp * 1000).format("YY-MM-DD HH:mm"));

            let timefrom_ts = zero_timestamp + -1 * (need_candle * curr_timeframe);
            let timeto_ts = timefrom_ts - (Math.floor((w + max_width) / frameWidth)) * curr_timeframe;

            div = this.getTimeScale(timeto_ts / 60, timefrom_ts / 60, w / 2, 80) * 60;

            let div_tf = 3 * 60;
            if (div > div_tf)
                div = Math.round(div / div_tf) * div_tf;

            div_tf = 5 * 60;
            if (div > div_tf)
                div = Math.round(div / div_tf) * div_tf;

            div_tf = 15 * 60;
            if (div > div_tf)
                div = Math.round(div / div_tf) * div_tf;

            div_tf = 30 * 60;
            if (div > div_tf)
                div = Math.round(div / div_tf) * div_tf;

            div_tf = 60 * 60;
            if (div > div_tf)
                div = Math.round(div / div_tf) * div_tf;

            div_tf = 120 * 60;
            if (div > div_tf)
                div = Math.round(div / div_tf) * div_tf;

            div_tf = 240 * 60;
            if (div > div_tf)
                div = Math.round(div / div_tf) * div_tf;

            div_tf = 360 * 60;
            if (div > div_tf)
                div = Math.round(div / div_tf) * div_tf;

            div_tf = 720 * 60;
            if (div > div_tf)
                div = Math.round(div / div_tf) * div_tf;

            div_tf = 1440 * 60;
            if (div > div_tf)
                div = Math.round(div / div_tf) * div_tf;

            div = Math.round(div / 60) * 60;

            timeto_ts = Math.floor(timeto_ts / div) * div;
            timefrom_ts = Math.floor(timefrom_ts / div) * div;

            //console.log(moment(timefrom_ts * 1000).format("HH:mm"), moment(timeto_ts * 1000).format("HH:mm"));

            //to = Math.ceil(to / div) * div;
            //timefrom = Math.floor(timefrom / div) * div;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            iter = 0;
            for (let t = timeto_ts; t <= timefrom_ts; t += div) {
                iter ++;
                if (iter > 100) break;

                let offset = (data[data_offset].timestamp - t) / 60;
                let x = this.parent.parent.offsetWidth - offset * frameWidth - frameWidth/2 - 1;

                ctx.beginPath();
                ctx.strokeStyle = theme.colors.axe_lines//(this.params.theme&&this.params.theme.axis_lines_color)?this.params.theme.axis_lines_color:'';
                //ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 1;
                ctx.moveTo(Math.round(scrollX + x) + .5, 0);
                ctx.lineTo(Math.round(scrollX + x) + .5, h);
                ctx.stroke();

                let tf = this.parent.parent.config.timeframe ? this.parent.parent.config.timeframe : 1;
                let text = moment((t - offset * 60 * (tf - 1)) * 1000).format("HH:mm");
                ctx.fillText(text, x + scrollX, h - (this.layer.touchMode?15:9), max_width);
            }
        }

    }

}

export default PriceAxe