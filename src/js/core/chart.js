"use strict";

const lodash = require("lodash");
lodash.noConflict();
const EventEmitter = require("events").EventEmitter;

import Theme from "../themes/themes"
import Crosshair from "./crosshairs"
import CandleLayer from "../layers/candle_layer"
import DataProvider from "../data_provider/data_provider"

const default_config = {
    width: "auto",
    theme: "DefaultDark",
}

function GetZoomLevel() {
    var zoomLevel;

    //If the browser supports the corrent API, then use that
    if (screen && screen.deviceXDPI && screen.logicalXDPI)
    { 
        //IE6 and above
        zoomLevel = (screen.deviceYDPI / screen.logicalYDPI);
    }
    else
    {
        //Chrome (see http://htmldoodads.appspot.com/dimensions.html)
        zoomLevel = window.outerWidth / window.innerWidth; //e.g. 1680 / 420
    }
    return zoomLevel;
}


class ALFAChart extends EventEmitter {
    constructor (el_id, config) {
        super();
        this.el = $("#" + el_id);
        this.config = lodash.extend({}, default_config, config);
    
        this.offsetWidth = 0;
        this.offsetHeight = 0;

        this.theme = new Theme(this.config.theme);
        this._init();        
    }    

    _init () {
        this.area = document.createElement('div');
        $(this.area).addClass('ac_workarea');

        this.chart = document.createElement('div');
        $(this.chart).addClass('ac_chart');

        

        this.canvas = document.createElement('canvas');
        this.linen = document.createElement('canvas');

        //let scale = GetZoomLevel();
        
        

        this.chart.append(this.canvas);
        this.chart.append(this.linen);
        this.area.append(this.chart);
        this.el.append(this.area);
        
        this._resize();
        this.clear();

        this.dataProvider = new DataProvider(this);
        this.layer = new CandleLayer(this);        
        this.crosshair = new Crosshair(this);

        this._autorefresh()
        setInterval(() => { this._autorefresh() }, 300);
    }

    clear () {
        var c = this.canvas;    
        var ctx = c.getContext("2d");                
    
        ctx.fillStyle = this.theme.colors.workarea_bg;
        ctx.fillRect(0, 0, c.width, c.height);
    }

    _resize () {
        this.touchMode = !!(navigator.userAgent.toLowerCase().match(/(android|iphone|ipod|ipad|blackberry)/));

        this.ratio = window.devicePixelRatio * 1;
        if (this.touchMode)
            this.ratio = 3;

        let width = $(this.el).width() * this.ratio,
            height = $(this.el).height() * this.ratio;
            
        this.canvas.width = width;            
        this.canvas.height = height;
        
        this.linen.width = width;
        this.linen.height = height;   
             
        this.offsetWidth = width;
        this.offsetHeight = height;    
        
        
    }

    _autorefresh() {
        this.layer.draw();
    }
}

import "./chart.styl";

export default ALFAChart;