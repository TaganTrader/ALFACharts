"use strict";

const default_config = {
    frameWidth: 12,
    frameHeight: 8,
    maxFrameHeight: 2000,
}

class Layer {

    constructor (parent, config) {
        config = _.extend({}, default_config, config);
        this.config = config;
        this.parent = parent;

        this.frameWidth = config.frameWidth;
        this.frameHeight = config.frameHeight;
        this.frameMarginX = config.frameMarginX;
        this.frameMarginY = config.frameMarginY;

        this.tick = parent.dataProvider.tick;

        this._init();
    }

    timeframeInCoords (x, width)
    {
        var frameWidth = this.frameWidth;
        var scrollX = this.scrollX;
        return Math.floor((scrollX + (width - x)) / frameWidth);
    }

    _mousedown(e) {
        let chart = this.parent;
        if (e.offsetX <= chart.offsetWidth - this.price_axe_width)
            $(chart.linen).parent().addClass('ac_chart_cur_grabbing');
        else
            $(chart.linen).parent().addClass('ac_chart_cur_n-resize');
    

        this.mousedowned = true;
        this.baseMouseX = e.offsetX - this.scrollX;
        this.baseMouseY = e.offsetY - this.scrollY;
        this.baseScrollX = this.scrollX;
        this.baseFrameHeight = this.frameHeight;
    }

    _doubleclick (e) {
        // Если двойной клик на шкалу цен
        if (this.baseMouseX + this.baseScrollX > chart.offsetWidth - this.price_axe_width) {     
            this.parent.layer.autosize = true;
        }
        this.draw();
    }

    _mousemove(e) {
        let chart = this.parent;
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;

        if (this.mousedowned) {
            if (this.baseMouseX + this.baseScrollX <= chart.offsetWidth - this.price_axe_width) {     
                this.scrollX = e.offsetX - this.baseMouseX;
                this.scrollY = e.offsetY - this.baseMouseY;

                if (this.scrollX < -chart.offsetWidth * 0.9)
                    this.scrollX = -chart.offsetWidth * 0.9
            } else {
                this.parent.layer.autosize = false;
                let h = chart.offsetHeight;
                let start = Math.log2(100);                      
                let delta = (Math.abs(Math.log2(100 + 100 / h * Math.abs(e.offsetY - this.baseMouseY)) ) - start) * 4 + 1;                    
                if (e.offsetY - this.baseMouseY >= 0) 
                    this.frameHeight = this.baseFrameHeight / delta;      
                else
                    this.frameHeight = this.baseFrameHeight * delta;
                    
                // console.log(delta)

                if (this.frameHeight > this.config.maxFrameHeight)
                    this.frameHeight = this.config.maxFrameHeight;
            }      
            
            //self.draw_map();                 
        }                    
        this.draw();
    }


    _mouseup(e) {
        let chart = this.parent;
        this.mousedowned = false;
        this.now += this.scrollY / this.frameHeight * this.tick;
        this.scrollY = 0;
        //$(chart.linen).css('cursor', '');        
        //chart.linen.style.cursor = '';
        $(chart.linen).parent().removeClass('ac_chart_cur_n-resize ac_chart_cur_grabbing');
        this.draw();
    }

    _mouseleave(e) {
        this.mouse_in = false;
        this.mousedowned = false;
        this.draw();
    }

    _mouseenter(e) {
        this.mouse_in = true;
    }

    _mousewheel (e) {
        e = e.originalEvent;        
        /*if (system.key_states[16]) {
            if (e.deltaY > 0)
                self.params.fieldHeight = Math.round(self.params.fieldHeight / 1.1) - 1;
            else
                self.params.fieldHeight = Math.round(self.params.fieldHeight * 1.1) + 1;

            if (self.params.fieldHeight < 2)
                self.params.fieldHeight = 2;
            if (self.params.fieldHeight > 2000)
                self.params.fieldHeight = 2000;

            if (self.params.fieldHeight % 2 != 0)
                self.params.fieldHeight -= e.deltaY > 0?1:-1;
        } else {  */          
            let oldWidth = this.frameWidth;

            if (e.deltaY > 0)
                this.frameWidth = this.frameWidth / 1.15;
            else
                this.frameWidth = this.frameWidth * 1.15;
                    
            if (this.frameWidth < 1)
                this.frameWidth = 1;
            if (this.frameWidth > 150)
                this.frameWidth = 150;

            /*if (this.frameWidth % 2 == 0)
                this.frameWidth -= e.deltaY > 0?1:-1;*/

            //if (!system.key_states[17]) {
            let diff = this.frameWidth - oldWidth;
                        
            this.scrollX = this.scrollX + diff * Math.max(1, this.frameNum) - diff / 2;
            //}
        
        this.draw();
        return false;
    }

    _init () {
        let chart = this.parent;     
        this.scrollX = -chart.offsetWidth * 0.1;
        this.scrollY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouse_in = false;
        this.mousedowned = false;
        this.now = 0;
        this.baseFrameHeight = 0;
        this.price_axe_width = 46;


        $(chart.linen)
            .mousedown((e)  => this._mousedown(e))
            .mousemove((e)  => this._mousemove(e))
            .mouseup((e)    => this._mouseup(e))
            .mouseleave((e) => this._mouseleave(e))
            .mouseenter((e) => this._mouseenter(e))
            .dblclick((e)  => this._doubleclick(e))
            .on("mousewheel", (e) => this._mousewheel(e));
    }

    draw (ctx) {
        
        this.parent.layer.draw();
        /*let c = this.parent.linen;
        let ctx = c.getContext("2d");         
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.font = '14px "EXO 2"'; 
    
        // Отрисовка курсора
        this.parent.crosshair.draw(ctx);*/

    }
}

export default Layer