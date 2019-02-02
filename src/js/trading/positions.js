"use strict";


class Positions
{
    constructor (layer, data) {
        this.data = data;
        this.layer = layer;
    }

    draw(ctx, theme) {
        let layer = this.layer;
        let positions = this.data;
        let tick = layer.tick;

        let scrollX = layer.layer.scrollX;
        let scrollY = layer.layer.scrollY;
    
        let w = layer.width;
        let h = layer.height;
        let frameWidth = layer.frameWidth;
        let frameHeight = layer.frameHeight;

        ctx.setLineDash([0]);

        ctx.beginPath(); 

        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";
        ctx.font = '12px "EXO 2"';
        ctx.setLineDash([10,1]);


        for (let i = 0; i < positions.length; i++) {
            if (!positions[i] || positions[i].avgEntryPrice == null || positions[i].currentQty == 0) continue;
            let color = "";
            let y = layer.priceToCoords(positions[i].avgEntryPrice);
            if (positions[i].currentQty > 0) {

                color = theme.colors.positions.long.lines;
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;

                let x = Math.round(w * 0.03);
                

                ctx.moveTo(0, Math.round(y + scrollY) + .5);
                ctx.lineTo(w, Math.round(y + scrollY) + .5);
                ctx.stroke();

                ctx.fillStyle = theme.colors.positions.long.label;
                ctx.fillRect(
                    x, 
                    y + scrollY - 12, 
                    70, 
                    24);

                ctx.fillStyle = theme.colors.positions.long.label_text;
                let text = '▲ ' + (positions[i].currentQty).toLocaleString(); 
                ctx.fillText(text, x + 35, scrollY + y, 65);
            
            } else {
                color = theme.colors.positions.short.lines;
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;

                let x = Math.round(w * 0.03);

                ctx.moveTo(0, Math.round(y + scrollY) + .5);
                ctx.lineTo(w, Math.round(y + scrollY) + .5);
                ctx.stroke();

                ctx.fillStyle = theme.colors.positions.short.label;
                ctx.fillRect(
                    x, 
                    y + scrollY - 12, 
                    70, 
                    24);
                
                ctx.fillStyle = theme.colors.positions.short.label_text;
                let text = '▼ ' + (positions[i].currentQty).toLocaleString(); 
                ctx.fillText(text, x + 35, scrollY + y, 65);
            }

            ctx.textAlign = "center"; 
            ctx.textBaseline = "middle";            
            ctx.font = '12px "EXO 2"';
            ctx.fillStyle = color
            ctx.fillRect(w, y - 10 + scrollY, -layer.layer.price_axe_width, 20); 
            if (positions[i].currentQty > 0)                 
                ctx.fillStyle = theme.colors.positions.long.price_text;
            else
                ctx.fillStyle = theme.colors.positions.short.price_text;
            let text = (positions[i].currentQty > 0?'▲ ':'▼ ') + positions[i].avgEntryPrice.toFixed(1);
            ctx.fillText(text, w - layer.layer.price_axe_width / 2, y + scrollY);  
        }
    }
}


export default Positions;