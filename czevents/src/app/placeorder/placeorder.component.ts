import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GetdataService } from '../getdata.service';

@Component({
  selector: 'app-placeorder',
  templateUrl: './placeorder.component.html',
  styleUrls: ['./placeorder.component.css']
})
export class PlaceorderComponent {
  priceRange: any[] = []; // To store the price range dynamically
  priceRangeString: any;
  isSmallScreen: boolean = false;

  selectedCategory: any;
  eventDetails = {
    price: ''
  };
  Event: any;
  showChosenTicket = false;
  quantity = 1;
  
  constructor(private router: Router, private route2: ActivatedRoute, private getservice: GetdataService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    this.checkScreenWidth();
  }

  ngOnInit(): void {
    this.getEvent();
    const savedQuantity = localStorage.getItem('quantity');
    if (savedQuantity) {
      this.quantity = parseInt(savedQuantity, 10);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.isSmallScreen = window.innerWidth < 770;
  }
  
  displayEventDetails(): void {
    window.scrollTo(0, 0);
    const price = this.getPriceFromSelect();
    this.eventDetails.price = price;

    // Show chosen ticket details
    this.showChosenTicket = true;

    // Update the final price in localStorage
    localStorage.setItem('price', (this.getPriceNumber(price) * this.quantity).toString());
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
  
  @ViewChild('priceSelect') priceSelect!: ElementRef;

  private getPriceFromSelect(): string {
    if (!this.priceSelect) {
        console.error("Select element not found");
        return "0"; // Handle it appropriately
    }
    return this.priceSelect.nativeElement.options[this.priceSelect.nativeElement.selectedIndex].text;
}


  private getPriceNumber(price: string): number {
      const match = price.match(/\d+(\.\d+)?/);
      return match ? parseFloat(match[0]) : 0;
  }

  updatePrice(): void {
    const price = this.getPriceFromSelect();
    this.eventDetails.price = "Kč " + (this.getPriceNumber(price) * this.quantity).toString() + ".00";
    localStorage.removeItem("finalPrice");
    localStorage.setItem("finalPrice",  this.eventDetails.price);
  }

  updatePriceForResponsive(): void{
     this.eventDetails.price = "Kč " + (this.getPriceNumber(localStorage.getItem("price")) * this.quantity).toString() + ".00"
     localStorage.removeItem("finalPrice");
     localStorage.setItem("finalPrice", this.eventDetails.price);
  }

  increaseQuantityForRespo(): void {
    this.quantity++;
    this.updatePriceForResponsive();
  }

  decreaseQuantityForRespo(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.updatePriceForResponsive();
    }
  }
  
}
