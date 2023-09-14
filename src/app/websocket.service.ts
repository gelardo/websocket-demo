import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Scrip } from './scrip';
@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  public options: any = {
    connectionTimeout: 1000,
    maxRetries: 10,
  }
  private exchangeDetails: any = {
    exchange: 'DSE',
    exchangeIndex: 'DSEX',
    exchangeExtension: 'PB',
    selectedScrip: 'AAMRANET'
  }
  public scripData: Scrip;
  scrips: Scrip[] = [];

  private socket: ReconnectingWebSocket;
  messageReceived: Subject<string> = new Subject<string>();
  constructor() { }

  connect(): void {
    this.socket = new ReconnectingWebSocket(
      'wss://md.kslbd.net',
      [],
      this.options,
    )

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
      this.sendMessage(`20{"40":"7","E":"${this.exchangeDetails.exchange}"}`);
      setTimeout(() => {
        this.sendMessage(`${25 + this.exchangeDetails.exchange.length + this.exchangeDetails.exchangeIndex.length
          }{"80":"17","E":"${this.exchangeDetails.exchange}","S":"${this.exchangeDetails.exchangeIndex}"}`);
        this.sendMessage(`${25 + this.exchangeDetails.exchange.length + this.exchangeDetails.exchangeIndex.length
          }{"81":"17","E":"${this.exchangeDetails.exchange}","S":"${this.exchangeDetails.exchangeIndex}"}`,);
        this.sendMessage(`${25 + this.exchangeDetails.exchange.length + this.exchangeDetails.exchangeIndex.length
          }{"80":"17","E":"${this.exchangeDetails.exchange}","S":"${this.exchangeDetails.exchangeIndex}"}`,);
        this.sendMessage(`${18 + this.exchangeDetails.exchange.length}{"40":"32","E":"${this.exchangeDetails.exchange}"}`,);
        this.sendMessage(`${24 + this.exchangeDetails.exchange.length + this.exchangeDetails.exchangeIndex.length
          }{"81":"7","E":"${this.exchangeDetails.exchange}","S":"${this.exchangeDetails.exchangeIndex}"}`,
        );
        this.sendMessage(`${19 + this.exchangeDetails.exchange.length}{"40":"277","E":"${this.exchangeDetails.exchange}"}`,);
      }, 2000);
      setTimeout(() => {
        this.sendMessage(
          `${17 + this.exchangeDetails.exchange.length}{"40":"0","E":"${this.exchangeDetails.exchange}"}`,
        )
        this.sendMessage(`20{"40":"7","E":"${this.exchangeDetails.exchange}"}`)
        this.sendMessage(
          `${31 + this.exchangeDetails.selectedScrip.length
          }{"80":"30","E":"${this.exchangeDetails.exchange}","S":"${this.exchangeDetails.selectedScrip}\`${this.exchangeDetails.exchangeExtention}"}`,
        )
        this.sendMessage(
          `${30 + this.exchangeDetails.selectedScrip.length
          }{"80":"1","E":"${this.exchangeDetails.exchange}","S":"${this.exchangeDetails.selectedScrip}\`${this.exchangeDetails.exchangeExtention}"}`,
        )
      }, 3000)
    };

    this.socket.onmessage = (event) => {
      const message = event.data;
      // console.log('Received message:', message);
      this.messageReceived.next(message);
      const index = event.data.indexOf('{')
      const ndata = event.data.substring(index)
      const json = JSON.parse(ndata)
      // console.log(json);
      if (
        json['1'] === 194 &&
        json.sym.includes('PB')
      ) {
        this.addToScrip(
          {
            company: json.sym.slice(0, -3),
            lastTraded: 0,
            bid: 0,
            offer: 0,
            open: 0,
            high: 0,
            low: 0,
            volume: 0,
            percentageChange: 0,
            close: 0,
            bidQty: 0,
            offerQty: 0,
            totalTrade: 0,
            lastQty: 0,
            change: 0,
          }
        )
      }
      // if (
      //   json['1'] === 3 &&
      //   json.sym.includes('`PB')
      // ) {
      //   this.updataScrip({
      //     company: json.sym.slice(0, -3),
      //     lastTraded: json.
      //   })
      // }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(message: string): void {
    this.socket.send(message);
  }
  addToScrip(scrip: Scrip) {
    this.scrips.push(scrip)
    localStorage.setItem('scrips', JSON.stringify(this.scrips));
  }
  updataScrip(scrip: Scrip) {

  }
  closeConnection(): void {
    this.socket.close();
  }
}