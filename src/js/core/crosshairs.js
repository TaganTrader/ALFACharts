"use strict";


const default_config = {

}

class Crosshair {

    constructor (parent) {
        this.parent = parent;
    }


    draw () {
        var l = this.linen;
        var ctx = l.getContext("2d");    

        ctx.clearRect(0, 0, l.width, l.height);

    if (this.state.mouse_in) {        
        ctx.beginPath();
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = (this.params.theme&&this.params.theme.cursor_lines_color)?this.params.theme.cursor_lines_color:"rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        let y = Math.floor(this.state.y);
        ctx.moveTo(0, y + .5);
        ctx.lineTo(l.width, y + .5);

        ctx.font = '14px "EXO 2"'; 

        let x = Math.floor(this.state.x); //Math.floor(Math.floor((this.state.x - scrollX) / (fieldWidth + sep_x)) * (fieldWidth + sep_x) + (fieldWidth / 2) + scrollX);                
        let frameNum = this.timeframeInCoords(x, l.width) + 1;
        this.state.frameNum = frameNum;
        x = Math.round((l.width - frameNum * (fieldWidth + sep_x) + (fieldWidth / 2)) + scrollX);

        ctx.moveTo(x - .5, 0); 
        ctx.lineTo(x - .5, l.height);            
        ctx.stroke();
        ctx.fillStyle = "rgb(255, 255, 255)";

        let price = (this.state.now + (l.height / 2 - y) / (fieldHeight + sep_y) * this.state.step);
        price = (Math.round(price / 0.5) * 0.5).toFixed(1);
        // РўРµРєСЃС‚ РІРѕР·Р»Рµ РєСѓСЂСЃРѕСЂР°
        let text = /*scrollX + ', ' + scrollY + ', ' + frameNum + ', ' +*/ price;
        //ctx.fillText(text, x + 10, y - 30);

 

        if (frameNum > 0 && dp.markets[this.market].map && dp.markets[this.market].map.length >= frameNum) {
            ctx.fillStyle = "rgba(30, 30, 30, 0.7)";            
            ctx.fillRect(x - 50, l.height - 18, 100, 18);

            ctx.textAlign = "center"; 
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.font = '10px "EXO 2"';

            text = new Date(dp.markets[this.market].map[dp.markets[this.market].map.length - frameNum].ts).toString();
            ctx.fillText(text, x, l.height - 9);

            
        }

        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.font = '10px "EXO 2"';

        ctx.fillStyle = "rgba(100, 100, 100, 0.9)";
        ctx.fillRect(l.width, y - 10, -46, 20);

        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";
        ctx.font = '12px "EXO 2"';
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        
        text = price;
        ctx.fillText(text, l.width - 46 / 2, y);  
    }
    }

}