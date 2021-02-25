"use strict";

const default_config = {

}

class Crosshair {

    constructor (parent) {
        this.parent = parent;
        this._init();
    }


    _init() {

    }

    draw (ctx, layer, theme) {
        let chart = this.parent;
        ctx.beginPath();
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = theme.colors.crosshair_lines;
        ctx.lineWidth = 1;
        let y = Math.floor(layer.mouseY);
        ctx.moveTo(0, y + .5);
        ctx.lineTo(chart.offsetWidth, y + .5);

        let x = Math.round(layer.mouseX);
        let frameNum = layer.timeframeInCoords(x, chart.offsetWidth) + 1;
        layer.frameNum = frameNum;

        x = Math.round((chart.offsetWidth - frameNum * layer.frameWidth + ((layer.frameWidth) / 2)) + layer.scrollX);

        ctx.moveTo(x - .5, 0);
        ctx.lineTo(x - .5, chart.offsetHeight);
        ctx.stroke();
        ctx.fillStyle = "rgb(255, 255, 255)";

        let price = (layer.now + (chart.offsetHeight / 2 - y + chart.layer.layer.scrollY) / layer.frameHeight * layer.tick);
        price = (Math.round(price / 0.5) * 0.5).toFixed(chart.config.decimals);
        let text = price;


        ctx.fillStyle = theme.colors.crosshair_price_bg;
        let labelHeight = 20;
        if (layer.touchMode)
            labelHeight = Math.round(labelHeight * theme.mobile.scale / 2) * 2;
        ctx.fillRect(chart.offsetWidth, Math.round(y - labelHeight/2), -layer.price_axe_width, labelHeight);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let fontSize = 12;
        if (layer.touchMode)
            ctx.font = (fontSize * theme.mobile.font_scale) + 'px "EXO 2"';
        else
            ctx.font = (fontSize) + 'px "EXO 2"';
        ctx.fillStyle = theme.colors.crosshair_price;


        ctx.fillText(text, chart.offsetWidth - layer.price_axe_width / 2, y);

        frameNum = frameNum + chart.dataProvider.offset - 1;

        if (frameNum >= 0 && chart.dataProvider.data[frameNum]) {
            ctx.fillStyle = "rgba(70, 70, 70, 0.9)";
            let labelHeight = 20;
            if (layer.touchMode)
                labelHeight = Math.round(labelHeight * theme.mobile.font_scale * 0.85 / 2) * 2;
            ctx.fillRect(x - 50 * (layer.touchMode?theme.mobile.scale * 0.85:1), chart.offsetHeight - labelHeight, 100 * (layer.touchMode?theme.mobile.scale * 0.85:1), labelHeight);

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgb(255, 255, 255)";
            let fontSize = 11;
            if (layer.touchMode)
                ctx.font = (fontSize * theme.mobile.font_scale) + 'px "EXO 2"';
            else
                ctx.font = (fontSize) + 'px "EXO 2"';

            text = moment(chart.dataProvider.data[frameNum].timestamp * 1000).format("DD MMM YY   HH:mm");
            ctx.fillText(text, x, chart.offsetHeight - (layer.touchMode?15:9));
        }
    }


}

export default Crosshair;