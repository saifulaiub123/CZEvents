import { Component } from '@angular/core';
import { EventFilterService } from '../event-filter.service';
import { GetdataService } from '../getdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent {
  Events: any;
  filteredEvents: any;
  SearchTerm: any;

  constructor(private getservice: GetdataService, private eventfilterservice: EventFilterService, private router: Router) {
  }
  getEvents() {
    this.getservice.fetchEvents().subscribe(
      (data: any) => {
        this.Events = data.$values || [];
        this.calculatePriceRanges(); // Calculate price ranges for all events
        console.log(data); // Default to empty array if $values is not present
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

  ngOnInit() {
    this.eventfilterservice.data$.subscribe(data => {
      this.Events = data;
    });
    this.getEvents();
  }
  logOut(){
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("Authentication")
      this.router.navigate(['/AdminLogin']);
    }
  }
}
