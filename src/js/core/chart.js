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
    locale: 'en-EN',
    decimals: 2,
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
        if (typeof el_id === "string")
            this.el = $("#" + el_id);
        else
            this.el = $(el_id);
        this.config = lodash.extend({}, default_config, config);

        this.offsetWidth = 0;
        this.offsetHeight = 0;

        this.timerId = 0;

        this.theme = new Theme(this.config.theme);
        this._init();
        this.changeLocale(config.locale);
    }

    changeLocale (locale) {
        moment.locale(locale);
    }

    _init () {
        this.dataProvider = new DataProvider(this);

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


        this.layer = new CandleLayer(this);
        this.crosshair = new Crosshair(this);

        this._autorefresh()
        this.timerId = setInterval(() => { this._autorefresh() }, 300);
    }

    clear () {
        var c = this.canvas;
        var ctx = c.getContext("2d");

        ctx.fillStyle = this.theme.colors.workarea_bg;
        ctx.fillRect(0, 0, c.width, c.height);
    }

    isTouchMode() {
        return !!(navigator.userAgent.toLowerCase().match(/(android|iphone|ipod|ipad|blackberry)/));
    }

    _resize () {
        this.touchMode = this.isTouchMode();

        this.ratio = window.devicePixelRatio * 1;

        this.isMAC = !!(navigator.userAgent.toLowerCase().match(/(Macintosh|Mac OS X)/));

        if (this.touchMode)
            this.ratio = this.theme.mobile.scale;

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

    destroy () {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
        this.el.innerHTML = "";
    }
}

import "./chart.styl";

export default ALFAChart;