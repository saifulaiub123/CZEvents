import { Component } from '@angular/core';
import { GetdataService } from '../getdata.service';
import { EventFilterService } from '../event-filter.service';


@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})

export class InterfaceComponent {
  Events: any[] = [];
  filteredEvents: any[] = [];
  SearchTerm: string = '';

  filterOff: boolean = true;
  
  constructor(private getservice: GetdataService, private eventfilterservice: EventFilterService) {
  }
  
  ngOnInit() {
    this.getEvents();
    localStorage.removeItem("quantity");
    localStorage.removeItem("price");
    localStorage.removeItem("finalPrice");
  }


  getEvents() {
    this.getservice.fetchEvents().subscribe(
      (data: any) => {
        this.Events = data.$values || [];
        this.calculatePriceRanges(); // Calculate price ranges for all events
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }


  calculatePriceRanges(): void {
    this.Events.forEach(event => {
      if (event.priceRange && event.priceRange.$values) {
        const prices = event.priceRange.$values.map((priceObj: any) => priceObj.price);
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          event.priceRangeString = `${minPrice}.00 - ${maxPrice}.00`;
        } else {
          event.priceRangeString = 'No prices available';
        }
      } else {
        event.priceRangeString = 'Price range not available';
      }
    });
  }

  onHideFiltersChange(hideFilters: boolean): void {
    this.filterOff = hideFilters;
  }
  
}
