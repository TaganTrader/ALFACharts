"use strict";

import lodash from 'lodash';
import HAMMER from '../libs/hammer'

const default_config = {
    frameWidth: 12,
    frameHeight: 8,
    maxFrameHeight: 2000,
}

class Layer {

    constructor (parent, config) {
        config = lodash.extend({}, default_config, config);
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

    offset = function (elem) {
        var offsetLeft = elem.offsetLeft
            , offsetTop = elem.offsetTop
            , lastElem = elem;

        while (elem = elem.offsetParent) {
            if (elem === document.body) { //from my observation, document.body always has scrollLeft/scrollTop == 0
                break;
            }
            offsetLeft += elem.offsetLeft;
            offsetTop += elem.offsetTop;
            lastElem = elem;
        }
        if (lastElem && lastElem.style.position === 'fixed') { //slow - http://jsperf.com/offset-vs-getboundingclientrect/6
            //if(lastElem !== document.body) { //faster but does gives false positive in Firefox
            offsetLeft += window.pageXOffset || document.documentElement.scrollLeft;
            offsetTop += window.pageYOffset || document.documentElement.scrollTop;
        }
        return {
            left: offsetLeft,
            top: offsetTop
        };
    };

    _mousedown(e, touch) {
        e.preventDefault();
        event.cancelBubble = true;
        let chart = this.parent;
        let offsetX = e.offsetX * chart.ratio;
        let offsetY = e.offsetY * chart.ratio;


        if (e.center) {
            let offset = this.offset(chart.linen);
            offsetX = (e.srcEvent.pageX - offset.left) * chart.ratio;
            offsetY = (e.srcEvent.pageY - offset.top) * chart.ratio;
        }


        if (touch) {
            offsetX = (e.touches[0].pageX - e.touches[0].target.offsetLeft) * chart.ratio;
            offsetY = (e.touches[0].pageY - e.touches[0].target.offsetTop) * chart.ratio;
        }


        //// TODO: e resize cursor
        if (e.offsetX <= chart.offsetWidth - this.price_axe_width)
            $(chart.linen).parent().addClass('ac_chart_cur_grabbing');
        else
            $(chart.linen).parent().addClass('ac_chart_cur_n-resize');


        this.mousedowned = true;
        this.baseMouseX = offsetX - this.scrollX;
        this.baseMouseY = offsetY - this.scrollY;
        this.baseScrollX = this.scrollX;
        this.baseFrameWidth = this.frameWidth;
        this.baseFrameHeight = this.frameHeight;
        return false;
    }

    _doubleclick (e) {
        let chart = this.parent;
        // Если двойной клик на шкалу цен
        if (this.baseMouseX + this.baseScrollX > chart.offsetWidth - this.price_axe_width) {
            this.parent.layer.autosize = true;
        }
        let timePanelHeight = 20;
        if (this.touchMode)
            timePanelHeight *= 2;
        if (this.baseMouseX + this.baseScrollX <= chart.offsetWidth - this.price_axe_width &&
            this.baseMouseY > chart.offsetHeight - timePanelHeight) {
            this.frameWidth = chart.config.frameWidth?chart.config.frameWidth:8;
            this.scrollX = -this.price_axe_width - this.frameWidth;
        }
        this.draw();
        return false;
    }



    _mousemove(e, touch) {
        e.preventDefault();
        event.cancelBubble = true;
        let chart = this.parent;
        let offsetX = e.offsetX * chart.ratio;
        let offsetY = e.offsetY * chart.ratio;

        if (e.maxPointers && e.maxPointers > 1) return;


        if (e.center) {
            let offset = this.offset(chart.linen);
            offsetX = (e.srcEvent.pageX - offset.left) * chart.ratio;
            offsetY = (e.srcEvent.pageY - offset.top) * chart.ratio;
            //$('#debug').html(JSON.stringify(e.srcEvent.pageY, null, "  "));
        }

        /*if (touch) {
            offsetX = (e.touches[0].pageX - e.touches[0].target.offsetLeft) * chart.ratio;
            offsetY = (e.touches[0].pageY - e.touches[0].target.offsetTop) * chart.ratio;
        }*/

        this.mouseX = offsetX;
        this.mouseY = offsetY;
        let timePanelHeight = 20;
        if (this.touchMode)
            timePanelHeight *= 2; //// Условно. А вообще нужно пробраться к теме и забрать оттуда мобильный скейл

        if (this.mousedowned) {
            if (this.baseMouseX + this.baseScrollX <= chart.offsetWidth - this.price_axe_width &&
                this.baseMouseY <= chart.offsetHeight - timePanelHeight) {
                this.scrollX = offsetX - this.baseMouseX;
                this.scrollY = offsetY - this.baseMouseY;
            } else if (this.baseMouseX + this.baseScrollX > chart.offsetWidth - this.price_axe_width) {
                this.parent.layer.autosize = false;
                let h = chart.offsetHeight;
                let start = Math.log2(100);
                let delta = (Math.abs(Math.log2(100 + 100 / h * Math.abs(offsetY - this.baseMouseY)) ) - start) * 4 + 1;
                if (offsetY - this.baseMouseY >= 0)
                    this.frameHeight = this.baseFrameHeight / delta;
                else
                    this.frameHeight = this.baseFrameHeight * delta;
                //// bug, don't work with price 0.0000xxx
                // if (this.frameHeight > this.config.maxFrameHeight)
                //     this.frameHeight = this.config.maxFrameHeight;
            } else {
                let oldWidth = this.frameWidth;
                let w = chart.offsetWidth;
                let start = Math.log2(100);
                let delta = (Math.abs(Math.log2(100 + 100 / w * Math.abs(offsetX - this.baseMouseX - this.baseScrollX)) ) - start) * 4 + 1;
                if (offsetX - this.baseMouseX - this.baseScrollX >= 0)
                    this.frameWidth = this.baseFrameWidth / delta;
                else
                    this.frameWidth = this.baseFrameWidth * delta;

                if (this.frameWidth < 0.5)
                    this.frameWidth = 0.5;
                if (this.frameWidth > 150)
                    this.frameWidth = 150;

                let diff = this.frameWidth - oldWidth;
                //console.log(this.parent.layer.dataStartIndexOffset, this.frameNum)
                this.scrollX = this.scrollX + diff * this.parent.layer.dataStartIndexOffset - diff / 2;
            }
        }
        this.draw();
    }


    _mouseup(e) {
        e.preventDefault();
        let chart = this.parent;
        this.mousedowned = false;
        this.now += this.scrollY / this.frameHeight * this.tick;
        this.scrollY = 0;

        //$(chart.linen).css('cursor', '');
        //chart.linen.style.cursor = '';
        $(chart.linen).parent().removeClass('ac_chart_cur_n-resize ac_chart_cur_grabbing');
        this.draw();
        return false;
    }

    _mouseleave(e) {
        this.mouseX = -100;
        this.mouseY = -100;
        this.mouse_in = false;
        this.mousedowned = false;
        this._mouseup(e);
    }

    _mouseenter(e) {
        this.mouse_in = true;
    }

    _mousewheel (e) {
        e.preventDefault();
        event.cancelBubble = true;

        if (e.originalEvent)
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
            //let center = 0;
            //if (e.center)
            //    center = e.center.x;
            if (e.scale) {
                this.frameWidth = this._baseFrameWidth * e.scale;
            } else {
                if (!e.altKey && !e.shiftKey && e.deltaX == 0 && e.deltaY !== 0) {
                    //console.log('last', chart.last);
                    //console.log('next', e);
                    //chart.last = {};
                    if (e.deltaY > 0)
                        this.frameWidth = this.frameWidth / 1.15;
                    else
                        this.frameWidth = this.frameWidth * 1.15;
                }
                //chart.last = e;
            }

            if (this.frameWidth < 0.5)
                this.frameWidth = 0.5;
            if (this.frameWidth > 150)
                this.frameWidth = 150;

            /*if (this.frameWidth % 2 == 0)
                this.frameWidth -= e.deltaY > 0?1:-1;*/

            //if (!system.key_states[17]) {
            let diff = this.frameWidth - oldWidth;

            if (e.shiftKey && e.deltaX) {
                this.scrollX -= e.deltaX;
            } else
                this.scrollX = this.scrollX + diff * this.frameNum - diff / 2;

            //}

        this.draw();
        return false;
    }

    _pinchStart (e) {
        this._baseFrameWidth = this.frameWidth;
    }

    _init () {
        let chart = this.parent;
        this.scrollX = -160;
        this.scrollY = 0;
        this.mouseX = -100;
        this.mouseY = -100;
        this.mouse_in = false;
        this.mousedowned = false;
        this.now = 0;
        this.baseFrameWidth = 0;
        this.baseFrameHeight = 0;
        this.price_axe_width = 46;

        this.touchMode = chart.isTouchMode();

        if (this.touchMode)
        {
            var mc = new HAMMER.Manager(chart.linen);

            mc.add(new HAMMER.Pan({ threshold: 0, pointers: 0 }));
            mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan')]);


            mc.add(new HAMMER.Tap({ event: 'doubletap', taps: 2 }));
            mc.add(new HAMMER.Tap());


            mc.on("tap", (e) => { /* on tap */ } );
            mc.on("panstart", (e) => this._mousedown(e));
            mc.on("panmove", (e) => this._mousemove(e));
            mc.on("panend", (e) => this._mouseup(e));
            mc.on("pinchstart", (e) => this._pinchStart(e));
            mc.on("pinch", (e) => this._mousewheel(e));
            mc.on("doubletap", (e) => this._doubleclick(e));
        }


        $(chart.linen)
            .mousedown((e)  => this.touchMode?()=>{}:this._mousedown(e))
            .mousemove((e)  => this.touchMode?()=>{}:this._mousemove(e))
            .mouseup((e)    => this.touchMode?()=>{}:this._mouseup(e))
            .mouseleave((e) => this._mouseleave(e))
            .mouseenter((e) => this._mouseenter(e))
            .dblclick((e)   => this._doubleclick(e))
            .on("wheel", (e) => this._mousewheel(e))
            /*.on("touchstart", (e) => this._mousedown(e, true))
            .on("touchmove", (e) => this._mousemove(e, true))
            .on("touchend", (e) => this._mouseup(e)) */

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