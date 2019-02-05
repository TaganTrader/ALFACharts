'use strict';

import { EventEmitter } from "events";

class Connection extends EventEmitter
{
    constructor (processing, address) {
        super();
        this._init(processing, address);        
        this.query_id = new Date().getTime();
        this.queries_callbacks = [];
    }

    _init (processing, address)
    {
        this.ws = new WebSocket(address);        
        this.processing = processing;
        this.ws.onmessage = events => this.on_message(events);
        this.ws.onerror = this.on_error;
        this.ws.onclose = this.on_close;
    }

    send (msg) {                        
        if (typeof msg === "object")
        {
            return new Promise((resolve, reject) => {
                msg.qid = ++this.query_id;
                this.queries_callbacks[msg.qid] = data => { resolve(data) };
                this.ws.send(JSON.stringify(msg));
            })            
        }
    }

    on_message (event) {
        let data = JSON.parse(event.data);          
        if (data.method)
        {            
            if (typeof this.processing[data.method] === "function")
                this.processing[data.method].apply(this.processing, [data.params]);
            else
                this.processing.unrecognized.apply(this.processing, [data.params]);
        }
        else
        if (data.rqid)
        {                   
            if (typeof this.queries_callbacks[data.rqid] === "function") {
                this.queries_callbacks[data.rqid](data.data);
                delete this.queries_callbacks[data.rqid];
            }
        }
        else
            this.processing.unrecognized(data);
    }

    on_error () {
        console.log("Ошибка " + error.message);
    }

    on_close (event) {
        if (event.wasClean) {
            console.log('Соединение закрыто чисто');
            return;
        } else {
            console.log('Обрыв соединения'); // например, "убит" процесс сервера
        }
        console.log('Код: ' + event.code + ' причина: ' + event.reason);
        this._init();
    }    
}

export default Connection;