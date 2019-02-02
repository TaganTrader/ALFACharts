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
        
        let x = Math.floor(layer.mouseX);
        let frameNum = layer.timeframeInCoords(x, chart.offsetWidth) + 1;
        layer.frameNum = frameNum;
        x = Math.round((chart.offsetWidth - frameNum * layer.frameWidth + ((layer.frameWidth) / 2)) + layer.scrollX);

        ctx.moveTo(x - .5, 0); 
        ctx.lineTo(x - .5, chart.offsetHeight);
        ctx.stroke();
        ctx.fillStyle = "rgb(255, 255, 255)";


        /*if (frameNum > 0 && dp.markets[this.market].map && dp.markets[this.market].map.length >= frameNum) {
            ctx.fillStyle = "rgba(30, 30, 30, 0.7)";            
            ctx.fillRect(x - 50, l.height - 18, 100, 18);

            ctx.textAlign = "center"; 
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.font = '10px "EXO 2"';

            text = new Date(dp.markets[this.market].map[dp.markets[this.market].map.length - frameNum].ts).toString();
            ctx.fillText(text, x, l.height - 9);

            
        }*/

        let price = (layer.now + (chart.offsetHeight / 2 - y) / layer.frameHeight * layer.tick);
        price = (Math.round(price / 0.5) * 0.5).toFixed(1);
        let text = price;
        
        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";        
        ctx.font = '10px "EXO 2"';
        ctx.fillStyle = theme.colors.crosshair_price_bg;
            

        ctx.fillRect(chart.offsetWidth, y - 10, -layer.price_axe_width, 20);

        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";
        ctx.font = '12px "EXO 2"';
        ctx.fillStyle = theme.colors.crosshair_price;
        
        
        ctx.fillText(text, chart.offsetWidth - layer.price_axe_width / 2, y);  
    }


}

export default Crosshair;