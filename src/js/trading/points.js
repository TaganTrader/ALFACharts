"use strict";


class Points
{
    constructor (layer, data) {
        this.data = data;
        this.layer = layer;
    }

    draw_right_tangl(x, y, size, ctx) {
        ctx.beginPath();
        let sx = Math.round(size * 1.2 + x);
        let sy = Math.round(size + y);
        let msy = Math.round(-size + y);
        x = Math.round(x);
        y = Math.round(y);
        ctx.moveTo(x, y);
        ctx.lineTo(sx, sy);
        ctx.lineTo(sx, msy);
        ctx.fill();
    }

    draw_left_tangl(x, y, size, ctx) {
        ctx.beginPath();
        let sx = Math.round(size * 1.2 + x);
        let sy = Math.round(size + y);
        let msx = Math.round(-size * 1.2 + x);
        let msy = Math.round(-size + y);
        x = Math.round(x);
        y = Math.round(y);
        ctx.moveTo(x, y);
        ctx.lineTo(msx, sy);
        ctx.lineTo(msx, msy);
        ctx.fill();
    }

    draw(ctx, theme) {
        let layer = this.layer;
        let points = this.data;
        let tick = layer.tick;

        let scrollX = layer.layer.scrollX;
        let scrollY = layer.layer.scrollY;

        let w = layer.width;
        let h = layer.height;
        let frameWidth = layer.layer.frameWidth;
        let frameHeight = layer.layer.frameHeight;

        ctx.setLineDash([0]);

        ctx.beginPath();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let fontSize = 12;
        if (layer.layer.touchMode) {
            ctx.font = (fontSize * theme.mobile.font_scale) + 'px "EXO 2"';
        }
        else {
            theme.mobile.scale = 1;
            theme.mobile.font_scale = 1;
            ctx.font = (fontSize * (this.parent.parent.ratio * .65)) + 'px "EXO 2"';
        }

        let labelHeight = 20;
        if (layer.layer.touchMode)
            labelHeight = Math.round(labelHeight * theme.mobile.scale);

        ctx.setLineDash([5, 1]);

        for (let i in points) {
            if (!points.hasOwnProperty(i)) continue;
            let color = "";

            /*let x = layer.timestampToCoords(points[i].timestamp);
            let y = layer.priceToCoords(points[i].price);

            ctx.fillText("->", x + scrollX, y + scrollY);*/


            let y = layer.priceToCoords(points[i].price);
            let x = layer.timestampToCoords(points[i].timestamp);

            if (x + scrollX < -200) continue;
            if (x + scrollX > w - layer.layer.price_axe_width - frameWidth / 2) continue;

            // if (y + scrollY < -200) continue;
            // if (y + scrollY > h + 200) continue;

            let candle = layer.timestampToCandle(points[i].timestamp);

            if (!candle) continue;

            let text_y_up = layer.priceToCoords(candle.high) - 15;
            let text_y_down = layer.priceToCoords(candle.low) + 15;

            if (points[i].type == "stop")
            {
                ctx.fillStyle = "#FF82FA";
                this.draw_right_tangl(x + scrollX + frameWidth / 3, y + scrollY, 5, ctx);
                this.draw_left_tangl(x + scrollX - frameWidth / 3, y + scrollY, 5, ctx);
                ctx.fillText(points[i].name, x + scrollX, text_y_up + scrollY);
            } else
            if (points[i].side == "left")
            {
                ctx.fillStyle = "#2EAEFA";
                let offset = Math.min(candle.open, candle.close) >= points[i].price ? 2 : frameWidth / 3;
                this.draw_left_tangl(x + scrollX - offset, y + scrollY, 5, ctx);
                ctx.fillText(points[i].name, x + scrollX, text_y_down + scrollY);
            } else
            if (points[i].side == "right")
            {
                ctx.fillStyle = "#FF0000";
                let offset = Math.max(candle.open, candle.close) <= points[i].price ? 2 : frameWidth / 3;
                this.draw_right_tangl(x + scrollX + offset, y + scrollY, 5, ctx);
                ctx.fillStyle = "#FF5A00";
                ctx.fillText(points[i].name, x + scrollX, text_y_up + scrollY);
            }



            //ctx.fillText(text, w - layer.layer.price_axe_width / 2, y + scrollY);
        }
    }
}


export default Points;