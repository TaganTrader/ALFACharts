"use strict";


class Orders
{
    constructor (layer, data) {
        this.data = data;
        this.layer = layer;
    }

    draw(ctx, theme) {
        let layer = this.layer;
        let orders = this.data;
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
        
        ctx.setLineDash([5, 1]);


        for (let i in orders) {
            if (!orders.hasOwnProperty(i)) continue;
            let color = "";
            let y = layer.priceToCoords(orders[i].price);
            if (orders[i].side == "Buy") {

                color = theme.colors.orders.buy.lines;
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;

                let x = Math.round(w * 0.1);
                

                ctx.moveTo(0, Math.round(y + scrollY) + .5);
                ctx.lineTo(w, Math.round(y + scrollY) + .5);
                ctx.stroke();

                ctx.fillStyle = theme.colors.orders.buy.label;
                ctx.fillRect(
                    x, 
                    Math.round(y + scrollY), 
                    Math.round(70 * theme.mobile.font_scale), 
                    labelHeight);

                ctx.fillStyle = theme.colors.orders.buy.label_text;            
                let text_ = (orders[i].orderQty).toLocaleString(); 
                ctx.fillText(text_, x + 35 * theme.mobile.font_scale, scrollY + y + 12 * theme.mobile.font_scale, 65 * theme.mobile.font_scale);
            } else {
                color = theme.colors.orders.sell.lines;
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;

                let x = Math.round(w * 0.1);

                ctx.moveTo(0, Math.round(y + scrollY) + .5);
                ctx.lineTo(w, Math.round(y + scrollY) + .5);
                ctx.stroke();                

                ctx.fillStyle = theme.colors.orders.sell.label;
                ctx.fillRect(
                    x, 
                    Math.round(y + scrollY - labelHeight), 
                    Math.round(70 * theme.mobile.font_scale), 
                    labelHeight);
                
                ctx.fillStyle = theme.colors.orders.sell.label_text;                
                let text_ = (orders[i].orderQty).toLocaleString(); 
                ctx.fillText(text_, x + 35 * theme.mobile.font_scale, scrollY + y - 12 * theme.mobile.font_scale, 65 * theme.mobile.font_scale);
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
            if (orders[i].side == "Buy")                 
                ctx.fillStyle = theme.colors.orders.buy.price_text;
            else
                ctx.fillStyle = theme.colors.orders.sell.price_text;
            let text = orders[i].price.toFixed(1);
            ctx.fillText(text, w - layer.layer.price_axe_width / 2, y + scrollY);  
        }
    }
}


export default Orders;