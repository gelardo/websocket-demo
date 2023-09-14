import { Component } from '@angular/core';
import { Scrip } from '../scrip';

@Component({
  selector: 'app-market-data',
  templateUrl: './market-data.component.html',
  // template: '<p></p>',
  styleUrls: ['./market-data.component.css']
})
export class MarketDataComponent {
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  scrips: Scrip[] = [];
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true

    }
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('scrips') !== null &&
      localStorage.getItem('scrips') !== 'undefined' &&
      localStorage.getItem('scrips') !== 'null'
    ) {
      this.scrips = JSON.parse(localStorage.getItem('scrips')!);
    }
    console.log('====================================');
    console.log(this.scrips);
    console.log('====================================');
  }
}
