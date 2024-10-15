import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventFilterService } from '../event-filter.service';
import { GetdataService } from '../getdata.service';
import { UserserviceService } from '../auth/userservice.service';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  events: any[] = []; // Initialize with an empty array
  filteredEvents: any[] = [];
  searchBarInput = document.querySelector('.searchBarInput');

  @Input() showSlider: boolean = true;

  constructor(private eventFilterService: EventFilterService, private getservice: GetdataService, private userService: UserserviceService, private router: Router, private cd: ChangeDetectorRef) {
    this.getservice.fetchEvents().subscribe(x => this.events = x);
  }

  filterEvents(eventtype: any){
    if (eventtype === 'ALL') {
      this.getservice.fetchEvents().subscribe(events => {
        this.events = events;
        this.eventFilterService.sendData(this.events);
      });
    } else {
      this.getservice.fetchEvents().subscribe(events => {
        this.events = events.filter(event => event.type == eventtype);
        this.eventFilterService.sendData(this.filteredEvents);
      });
    }
  }

  @ViewChild('navBarBottom') navBarBottom!: ElementRef;

  menuVisible: boolean = false;

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    if (this.menuVisible) {
      this.navBarBottom.nativeElement.style.display = 'none';
      document.body.style.overflow = 'hidden'; 
      document.body.style.width = '100%';
      document.body.style.height = '100vh';
    } else {
      this.navBarBottom.nativeElement.style.display = 'block'; 
      document.body.style.overflow = ''; 
      document.body.style.width = '';
      document.body.style.height = '';
    }
  }

  hideMenuAndNavigate(route: string) {
    this.toggleMenu();
  }

  user: any;
  isLoggedIn = false;

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  logout() {
    this.isLoggedIn = false;
  
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    
    this.userService.clearUser(); // Clear user data in the service
  
    this.router.navigate(['/Main']).then(() => {
      this.cd.detectChanges(); // Trigger change detection manually
    });
  }
}
