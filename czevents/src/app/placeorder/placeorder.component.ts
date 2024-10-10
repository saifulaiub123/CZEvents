import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetdataService } from '../getdata.service';

@Component({
  selector: 'app-placeorder',
  templateUrl: './placeorder.component.html',
  styleUrls: ['./placeorder.component.css']
})
export class PlaceorderComponent {
  priceRange: any[] = []; // To store the price range dynamically
  priceRangeString: any;

  selectedCategory: any;
  eventDetails = {
    price: ''
  };
  Event: any;
  showChosenTicket = false;
  quantity = 1;
  
  constructor(private router: Router, private route2: ActivatedRoute, private getservice: GetdataService) {}

  ngOnInit(): void {
    this.getEvent();
    const savedQuantity = localStorage.getItem('quantity');
    if (savedQuantity) {
      this.quantity = parseInt(savedQuantity, 10);
    }
  }

  displayEventDetails(): void {
    const price = this.getPriceFromSelect();
    this.eventDetails.price = price;

    // Show chosen ticket details
    this.showChosenTicket = true;

    // Update the final price in localStorage
    localStorage.setItem('finalPrice', (this.getPriceNumber(price) * this.quantity).toString());
  }

  dissapearEvent(): void {
    this.showChosenTicket = false;
    localStorage.removeItem("finalPrice");
    localStorage.removeItem("price");
    localStorage.removeItem("quantity");
    this.quantity = 1;
  }

  buyTicket(): void {
    const price = this.getPriceFromSelect();
    localStorage.setItem('price', price);
    this.router.navigate(['/payment-gateway']); // Redirect to payment page
  }

  increaseQuantity(): void {
    this.quantity++;
    this.updatePrice();
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.updatePrice();
    }
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

  getEvent(): void {
    const id = parseInt(this.route2.snapshot.paramMap.get('id')!, 10);
    this.getservice.getEvent(id).subscribe(event => {
      this.Event = event;
      this.calculatePriceRange();
      if (this.Event && this.Event.priceRange && this.Event.priceRange.$values) {
        this.priceRange = this.Event.priceRange.$values; // Assign the prices to the array
      }
    });
  }
  

  private getPriceFromSelect(): string {
    const selectElement = document.getElementById('price-select') as HTMLSelectElement;
    return selectElement.options[selectElement.selectedIndex].text;
  }

  private getPriceNumber(price: string): number {
    const match = price.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  }

 updatePrice(): void {
    const price = this.getPriceFromSelect();
    localStorage.setItem('quantity', this.quantity.toString());
    localStorage.setItem('finalPrice', (this.getPriceNumber(price) * this.quantity).toString());
    this.eventDetails.price = "Kč " + (this.getPriceNumber(price) * this.quantity).toString() + ".00";
  }
  
}
