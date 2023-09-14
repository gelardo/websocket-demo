import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { HttpClient } from '@angular/common/http';
import { Scrip } from './scrip';
@Component({
  selector: 'app-root',
  // template: `
  //   <button (click)="sendMessage()">Send Message1</button>
  //   <ul>
  //   <li *ngFor="let message of receivedMessages">{{ message }}</li>
  // </ul>
  // `,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  receivedMessages: string[] = [];
  constructor(private websocketService: WebsocketService, private http: HttpClient) { }

  ngOnInit(): void {
    this.websocketService.connect();
    this.websocketService.messageReceived.subscribe((message: string) => {
      this.receivedMessages.push(message);
    });
  }
  sendMessage(): void {
    const message = '115{"AUTHVER":"10","LOGINIP":"","CLVER":"1.0.0","PDM":"56","LAN":"EN","METAVER":"0","SSOTOK":"DEMO1UNI","SSOTYPE":"2"}';
    this.websocketService.sendMessage(message);
  }
}