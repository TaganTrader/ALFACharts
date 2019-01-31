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
        ctx.font = '12px "EXO 2"';
        ctx.setLineDash([5,1]);


        for (let i = 0; i < orders.length; i++) {
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
                    y + scrollY, 
                    70, 
                    24);

                ctx.fillStyle = theme.colors.orders.buy.label_text;
                let text = (orders[i].orderQty).toLocaleString(); 
                ctx.fillText(text, x + 35, scrollY + y + 12, 65);
            
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
                    y + scrollY - 24, 
                    70, 
                    24);
                
                ctx.fillStyle = theme.colors.orders.sell.label_text;
                let text = (orders[i].orderQty).toLocaleString(); 
                ctx.fillText(text, x + 35, scrollY + y - 12, 65);
            }

            ctx.textAlign = "center"; 
            ctx.textBaseline = "middle";            
            ctx.font = '12px "EXO 2"';
            ctx.fillStyle = color
            ctx.fillRect(w, y - 10 + scrollY, -layer.layer.price_axe_width, 20); 
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