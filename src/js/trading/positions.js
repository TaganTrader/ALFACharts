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

        ctx.setLineDash([0]);

        ctx.beginPath(); 

        let fontSize = 12;
        if (layer.layer.touchMode) {            
            ctx.font = (fontSize * theme.mobile.font_scale) + 'px "EXO 2"';
        }            
        else {
            theme.mobile.scale = 1;
            theme.mobile.font_scale = 1;
            ctx.font = (fontSize) + 'px "EXO 2"';
        }

        let labelHeight = 20;
        if (layer.layer.touchMode)
            labelHeight = Math.round(labelHeight * theme.mobile.scale); 
        
        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";        
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
                    Math.round(y + scrollY - labelHeight/2), 
                    Math.round(70 * theme.mobile.font_scale), 
                    labelHeight);

                ctx.fillStyle = theme.colors.positions.long.label_text;
                let text = '▲ ' + (positions[i].currentQty).toLocaleString(); 
                ctx.fillText(text, x + 35 * theme.mobile.font_scale, scrollY + y, 65 * theme.mobile.font_scale);
            
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
                    Math.round(y + scrollY - labelHeight/2), 
                    Math.round(70 * theme.mobile.font_scale), 
                    labelHeight);
                
                ctx.fillStyle = theme.colors.positions.short.label_text;
                let text = '▼ ' + (positions[i].currentQty).toLocaleString(); 
                ctx.fillText(text, x + 35 * theme.mobile.font_scale, scrollY + y, 65 * theme.mobile.font_scale);
            }

            ctx.textAlign = "center"; 
            ctx.textBaseline = "middle";            
            let fontSize = 12;
            if (layer.layer.touchMode)
                ctx.font = (fontSize * theme.mobile.font_scale) + 'px "EXO 2"';
            else
                ctx.font = (fontSize) + 'px "EXO 2"';
            ctx.fillStyle = color 
            ctx.fillRect(w, Math.round(y - labelHeight/2 + scrollY), -layer.layer.price_axe_width, labelHeight); 
            if (positions[i].currentQty > 0)                 
                ctx.fillStyle = theme.colors.positions.long.price_text;
            else
                ctx.fillStyle = theme.colors.positions.short.price_text;
            let text = positions[i].avgEntryPrice.toFixed(1);
            ctx.fillText(text, w - layer.layer.price_axe_width / 2, y + scrollY);  
        }
    }
}


export default Positions;