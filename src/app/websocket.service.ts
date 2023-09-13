import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import ReconnectingWebSocket from 'reconnecting-websocket';

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

  closeConnection(): void {
    this.socket.close();
  }
}