"use strict";

import Layer from './layer'
import PriceAxe from '../axis/price_axe'
import TimeAxe from '../axis/time_axe'
import Orders from '../trading/orders';
import lodash from 'lodash';
import Positions from '../trading/positions';
import Points from '../trading/points';

const default_config = {
    frameWidth: 12,
    frameHeight: 8,
    frameMarginX: 2,
    frameMarginY: 0,
    maxFrameHeight: 2000,
    autosize: true,
}

class CandleLayer {

    constructor (parent, config) {
        config = lodash.extend({}, default_config, config);
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

        this.layer.now = this.dataProvider.data.length > 0 ? this.dataProvider.data[0].close : 0;

        this.autosize = this.config.autosize;
        if (this.autosize)
            this.autosize_layer();


        this.orders = new Orders(this, this.dataProvider.orders);
        this.positions = new Positions(this, this.dataProvider.positions);
        this.points = new Points(this, this.dataProvider.points);
        this.dataStartIndexOffset = 0;
    }

    extremums (from, to) {
        let data = this.dataProvider.data;
        if (from < 0) {
            from = 0;
        }
        if (from > data.length - 1) from = data.length - 1;
        let min = data[from].low;
        let max = data[from].high;

        for (let i = from + 1; i < to && i < data.length; i++) {
            min = Math.min(data[i].low, min);
            max = Math.max(data[i].high, max);
        }

        return { min, max }
    }

    autosize_layer() {
        let chart = this.parent;

        if (this.dataProvider.data.length == 0) return;

        let extremums = this.extremums(this.dataStartIndexOffset, this.dataProvider.offset + Math.round((chart.offsetWidth + this.layer.scrollX) / this.layer.frameWidth));

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

    timestampToCoords(timestamp) {
        let chart = this.parent;
        let frameWidth = this.layer.frameWidth;
        let data = this.dataProvider.data;

        if (this.dataProvider.data.length == 0) return 0;

        timestamp = Math.floor(timestamp / 1000 / 60) * 60;

        let offset = (data[this.dataProvider.offset].timestamp - timestamp) / 60 / (chart.config.timeframe?chart.config.timeframe:1);
        return chart.offsetWidth - offset * frameWidth - frameWidth / 2;
    }

    timestampToCandle(timestamp) {
        let chart = this.parent;
        let frameWidth = this.layer.frameWidth;
        let data = this.dataProvider.data;

        if (this.dataProvider.data.length == 0) return 0;

        timestamp = Math.floor(timestamp / 1000 / 60) * 60;

        let offset = (data[0].timestamp - timestamp) / 60 / (chart.config.timeframe?chart.config.timeframe:1);
        if (offset < 0) return null;
        if (offset >= data.length) return null;
        return data[offset];
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

        if (this.dataProvider.data.length == 0) return;

        let from = this.dataStartIndexOffset
        let to = this.dataProvider.offset + Math.ceil((w + scrollX) / frameWidth);// data.length - 1;

        if (to > data.length - 1)
            to = data.length - 1;

        if (data.length - to < 2000)
            this.dataProvider.needLastData();

        if (from < 1000 && data.length > 0 && data[0].timestamp < new Date().getTime() / 1000 - 10 * 60)
            this.dataProvider.needNextData();

        for (let i = from; i <= to; i++) {
            let open = Math.round(this.priceToCoords(data[i].open) + scrollY);
            let close = Math.round(this.priceToCoords(data[i].close) + scrollY);
            let high = Math.round(this.priceToCoords(data[i].high) + scrollY);
            let low = Math.round(this.priceToCoords(data[i].low) + scrollY);

            let candle_width = Math.round(Math.max(frameWidth - this.layer.frameMarginX - 2, 1) / 2) * 2 + 1;

            let x = Math.round(w - ((frameWidth - this.layer.frameMarginX) / 2) + scrollX - 1 - (i - this.dataProvider.offset) * frameWidth);

            /*if (i == to && x > -w) {
                this.dataProvider.needLastData();
            }

            if (i == 0 && x < w) {
                if (data[i].timestamp < new Date().getTime() / 1000 - 10 * 60)
                    this.dataProvider.needNextData(this);
            }*/

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
            ctx.strokeStyle = theme.colors.candles.shadow ? theme.colors.candles.shadow : color;
            ctx.lineWidth = 1;

            ctx.moveTo(x - .5, high);
            ctx.lineTo(x - .5, low);
            ctx.stroke();

            /* // Видно внутри тень свечи
            var grd = ctx.createLinearGradient(0, y, 0, y + height + 1);
            grd.addColorStop(0, color);
            if (data[i].close >= data[i].open) {
                grd.addColorStop(0.5, "rgba(102, 204, 102, 0.5)");
            } else {
                grd.addColorStop(0.5, "rgba(237, 104, 74, 0.5)");
            }
            grd.addColorStop(1, color);  */

            /* // Градиент с прозрачностью вниз
            var grd = ctx.createLinearGradient(0, y, 0, y + height + 1);
            grd.addColorStop(0, color);
            if (data[i].close >= data[i].open) {
                grd.addColorStop(1, "rgba(102, 204, 102, 0.5)");
            } else {
                grd.addColorStop(1, "rgba(237, 104, 74, 0.5)");
            }
            ctx.fillStyle=grd;*/

            ctx.fillRect(
                Math.round(x - candle_width / 2) - 1,
                y,
                Math.round(candle_width),
                height + 1);
        }

    }

    draw_price(ctx, theme)
    {
        let chart = this.parent;
        let data = this.dataProvider.data;
        let tick = this.layer.tick;

        let scrollX = this.layer.scrollX;
        let scrollY = this.layer.scrollY;

        let w = this.parent.offsetWidth;
        let h = this.parent.offsetHeight;
        let frameWidth = this.layer.frameWidth;
        let frameHeight = this.layer.frameHeight;

        // Рисуем линию цены
        if (data.length > 0) {
            let candle = data[this.dataStartIndexOffset];
            let y = scrollY + this.priceToCoords(candle.close);
            let y0 = scrollY + this.priceToCoords(data[0].close);

            let color = "";
            if (data[0].close >= data[0].open) {
                color = theme.colors.candles.bull.price_line;
            } else {
                color = theme.colors.candles.bear.price_line;
            }


            if (data[0].timestamp > new Date().getTime() / 1000 - 10 * 60)
            {
                ctx.beginPath();
                ctx.setLineDash([1, 1]);
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.moveTo(0, Math.round(y0) + .5);
                ctx.lineTo(w, Math.round(y0) + .5);
                ctx.stroke();
            }

            if (candle.close >= candle.open) {
                color = theme.colors.candles.bull.price_line;
            } else {
                color = theme.colors.candles.bear.price_line;
            }

            ctx.fillStyle = color;
            let labelHeight = 20
            if (this.layer.touchMode)
                labelHeight = Math.round(labelHeight * theme.mobile.scale);
            ctx.fillRect(w, Math.round(y - labelHeight / 2), -this.layer.price_axe_width, labelHeight);

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            let fontSize = 12;
            if (this.layer.touchMode)
                ctx.font = (fontSize * theme.mobile.font_scale) + 'px "EXO 2"';
            else
                ctx.font = (fontSize) + 'px "EXO 2"';

            if (candle.close >= candle.open)
                ctx.fillStyle = theme.colors.candles.bull.price_text;
            else
                ctx.fillStyle = theme.colors.candles.bear.price_text;
            let text = candle.close.toFixed(chart.config.decimals?chart.config.decimals:2);
            ctx.fillText(text, w - this.layer.price_axe_width / 2, y);
        }
    }

    draw () {
        this.parent._resize();

        this.width = this.parent.offsetWidth;
        this.height = this.parent.offsetHeight;

        // Высчитываем индекс в массиве данных первой свечи
        this.dataStartIndexOffset = Math.ceil(this.dataProvider.offset + (this.layer.scrollX + this.layer.price_axe_width) / this.layer.frameWidth);
        if (this.dataStartIndexOffset < 0)
            this.dataStartIndexOffset = 0;
        if (this.dataStartIndexOffset > this.dataProvider.data.length - 1)
            this.dataStartIndexOffset = this.dataProvider.data.length - 1;

        if (this.autosize) {
            this.autosize_layer()
            this.layer.scrollY = 0;
        }

        var c = this.parent.linen;
        var ctx = c.getContext("2d");

        ctx.fillStyle = this.parent.theme.colors.workarea_bg;
        ctx.fillRect(0, 0, c.width, c.height);

        let theme = this.parent.theme;

        this.axis.price_axe.draw(ctx, theme);

        if (this.parent.config.labels) {
            ctx.font = (this.parent.config.labels.fontSize?this.parent.config.labels.fontSize:70) + 'px ' + (this.parent.config.labels.fontName?this.parent.config.labels.fontName:'"EXO 2"');
            ctx.fillStyle = (this.parent.config.labels.color?this.parent.config.labels.color:"rgba(0, 0, 0, 0.15)");
            ctx.fillText(this.parent.config.labels.label1_text, this.width/2, this.height/2 - (this.parent.config.labels.offset?this.parent.config.labels.offset:60));
            ctx.fillText(this.parent.config.labels.label2_text, this.width/2, this.height/2 + (this.parent.config.labels.offset?this.parent.config.labels.offset:60));
        }

        this.draw_candles(ctx, theme);
        this.orders.draw(ctx, theme);
        this.positions.draw(ctx, theme);
        this.points.draw(ctx, theme);
        this.draw_price(ctx, theme);
        this.parent.crosshair.draw(ctx, this.layer, theme);
    }

}

export default CandleLayer