import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  constructor(private router: Router) {}

  navigateToBuyer(section: string) {
    this.router.navigate(['/Buyer'], { queryParams: { section: section } });
  }
  navigateToOrganizer(section: string) {
    this.router.navigate(['/Organizer'], { queryParams: { section: section } });
  }
}
