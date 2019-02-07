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
        this.address = address;
        this.ws.onmessage = event => this.on_message(event);
        this.ws.onerror = error => this.on_error(error);
        this.ws.onclose = event => this.on_close(event);
    }

    send (msg) {        
        return new Promise((resolve, reject) => {
            msg.qid = ++this.query_id;            
            let timeout = setTimeout(() => { reject() }, 2000);
            this.queries_callbacks[msg.qid] = data => { clearTimeout(timeout); resolve(data) };
            if (this.ws.readyState === 1)
                this.ws.send(JSON.stringify(msg));
            else
                reject();
        });        
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

    on_error (error) {
        console.log("Ошибка " + error.message);
        setTimeout(() => {
            this._init(this.processing, this.address);
        }, 1000);
    }

    on_close (event) {
        if (event.wasClean) {
            console.log('Соединение закрыто чисто');
            return;
        } else {
            console.log('Обрыв соединения'); // например, "убит" процесс сервера
        }
        console.log('Код: ' + event.code + ' причина: ' + event.reason);
        setTimeout(() => {
            this._init(this.processing, this.address);
        }, 1000);
        
    }    
}

export default Connection;