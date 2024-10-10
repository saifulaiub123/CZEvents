import { Component } from '@angular/core';
import { GetdataService } from '../getdata.service';
import { EventFilterService } from '../event-filter.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-filtered-events',
  templateUrl: './filtered-events.component.html',
  styleUrls: ['./filtered-events.component.css']
})
export class FilteredEventsComponent {
  Events: any[] = [];
  SearchTerm: string = '';
  filterOff: boolean = true;

  constructor(private getservice: GetdataService, private route: ActivatedRoute) {}


  calculatePriceRanges(): void {
    this.Events.forEach(event => {
      if (event.priceRange && event.priceRange.$values) {
        const prices = event.priceRange.$values.map((priceObj: any) => priceObj.price);
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          event.priceRangeString = `${minPrice}.00 - ${maxPrice}.00`;
        } else {
          console.warn('No prices available for event:', event);
          event.priceRangeString = 'No prices available';
        }
      } else {
        console.warn('Price range not available for event:', event);
        event.priceRangeString = 'Price range not available';
      }
    });
  }
  

  onHideFiltersChange(hideFilters: boolean): void {
    this.filterOff = hideFilters;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      if (type) {
        this.getEventsByCountry(type);
      }
    });
    localStorage.removeItem("quantity");
    localStorage.removeItem("price");
    localStorage.removeItem("finalPrice");
  }

  getEventsByCountry(country: string): void {
    this.getservice.getEventsByCountry(country).subscribe((data: any) => {
      this.Events = data.$values || [];
      this.calculatePriceRanges(); // Debug log to verify the data
    });
  }
}
