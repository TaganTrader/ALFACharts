"use strict";

import Connection from './connection'
import Processing from './processing';

class DataProvider {

    constructor (chart) {
        this.processing = new Processing(this, chart);
        //this.connection = new Connection(this.processing, ""); //wss://ds1.texer.org:8443

        //this.connection.ws.onopen = () => { this.connection_open() };

        this.tick = 0.05;

        this.offset = 0;

        this.orders = [

        ];

        this.positions = [

        ];

        this.points = [
            // {
            //     name: "short",
            //     side: "right",
            //     price: 3823.5,
            //     timestamp: new Date('2019-02-28 17:02:23').getTime(),
            //     type: "limit",
            // },
            // {
            //     name: "long",
            //     side: "left",
            //     price: 3819,
            //     timestamp: new Date('2019-02-28 17:15:11').getTime(),
            //     type: "limit",
            // },
            // {
            //     name: "stop_long",
            //     side: "right",
            //     price: 3816.5,
            //     timestamp: new Date('2019-02-28 17:28:11').getTime(),
            //     type: "stop",
            // }
        ]

        this.data = [];

        this.timeframe = 60;

        //// Вернуть потом обновления
        // setInterval(() => {
        //    this.update();
        // }, 1500);
    }

    connection_open ()
    {
        //this.moveTo(new Date('2019-02-06 00:00:00').getTime() / 1000, true);
        //this.moveTo(new Date('2017-03-03 00:00:00').getTime() / 1000, true);
        this.moveTo(new Date().getTime() / 1000, false);
    }

    needLastData()
    {
        // if (!this.__p_needData && this.data.length > 0) {
        //     this.__p_needData = true;
        //     let to = this.data[this.data.length - 1].timestamp - 60;
        //     if (to < 1483228740)
        //     {
        //         this.__p_needData = false;
        //         return;
        //     }
        //     this.connection.send({ method: "candles", params: { from: to - 1000 * 60, to: to } }).then(candles => {
        //         candles.reverse();
        //         this.data = this.data.concat(candles);
        //         this.__p_needData = false;
        //     }).catch (() => {
        //         this.__p_needData = false;
        //     });
        // }

    }

    needNextData()
    {
        // if (!this.__p_needData) {
        //     this.__p_needData = true;
        //     let from = this.data[0].timestamp + 60;
        //     // Не запрашивать свечи которых не может быть.
        //     if (from > new Date().getTime() / 1000 + 5 * 60) {
        //         this.__p_needData = false;
        //         return;
        //     }
        //     this.connection.send({ method: "candles", params: { from: from, to: from + 1000 * 60 } }).then(candles => {
        //         candles.reverse();
        //         this.offset += candles.length;
        //         this.data = candles.concat(this.data);
        //         this.__p_needData = false;
        //     }).catch (() => {
        //         this.__p_needData = false;
        //     });
        // }
    }

    update() {
        // if (!this.__p_needData && this.data.length > 3) {
        //     this.__p_needData = true;
        //     let from = this.data[3].timestamp;
        //     let to = Math.floor(new Date().getTime() / 1000) + 5 * 60;
        //     // скорее всего заружены исторические данные
        //     if (Math.abs(from - to) > 1000) {
        //         this.__p_needData = false;
        //         return;
        //     }
        //     this.connection.send({ method: "candles", params: { from, to } }).then(candles => {
        //         for (let i = 0; i < candles.length; i++) {
        //             if (3 - i == 0) {} else
        //             if (3 - i > 0) {
        //                 if (this.data[3 - i].timestamp === candles[i].timestamp) {
        //                     this.data[3 - i] = candles[i];
        //                     //console.log('Успешное обновление ', 3 - i);
        //                 }
        //             } else {
        //                 if (this.data[0].timestamp + 60 === candles[i].timestamp)
        //                     this.data.unshift(candles[i]);
        //             }
        //         }
        //         this.__p_needData = false;
        //     }).catch (() => {
        //         this.__p_needData = false;
        //     });
        // }
    }

    moveTo(timeframe, toMiddle)
    {
        // if (!this.__p_needData) {
        //     this.__p_needData = true;
        //     this.connection.send({ method: "candles", params: { from: timeframe - 1000 * 60, to: timeframe + 0 * 60 }}).then(candles => {
        //         candles.reverse();
        //         if (toMiddle)
        //             this.offset = 500//candles.length / 2;
        //         else
        //             this.offset = 0;
        //         this.data = candles;

        //         this.__p_needData = false;
        //     }).catch (() => {
        //         this.__p_needData = false;
        //     });
        // }
    }

}

export default DataProvider