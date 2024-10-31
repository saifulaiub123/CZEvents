import { Component } from '@angular/core';
import { GetdataService } from '../getdata.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-eventpage',
  templateUrl: './eventpage.component.html',
  styleUrls: ['./eventpage.component.css']
})
export class EventpageComponent {
  Event: any;
  priceRangeString: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private getservice: GetdataService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {
    this.getEvent();
    localStorage.removeItem("quantity");
    localStorage.removeItem("price");
    localStorage.removeItem("finalPrice");
  }

  getEvent(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.getservice.getEvent(id)
      .subscribe(event => {
        this.Event = event;
        this.calculatePriceRange();
      });
  }
  calculatePriceRange(): void {
    if (this.Event && this.Event.priceRange && this.Event.priceRange.$values) {
      const prices = this.Event.priceRange.$values.map((priceObj: any) => priceObj.price);
      
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        this.priceRangeString = `${minPrice}.00 - ${maxPrice}.00`;
      } else {
        this.priceRangeString = 'No prices available';
      }
    } else {
      this.priceRangeString = 'Price range not available';
    }
  }
}
