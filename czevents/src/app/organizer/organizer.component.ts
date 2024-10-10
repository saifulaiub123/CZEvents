import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css']
})
export class OrganizerComponent {
  allInfo: boolean = false;
  generaltermsInfo: boolean = false;
  

  togglePaymentInfo(paymentInfo: string) {
    this.allInfo = paymentInfo === 'allInfo';
    this.generaltermsInfo = paymentInfo === 'generaltermsInfo';
  }
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const section = params['section'];
      this.resetInfo();
      switch (section) {
        case 'all':
          this.allInfo = true;
          break;
        case 'terms':
          this.generaltermsInfo = true;
          break;
      }
    });
  }

  resetInfo() {
    this.allInfo = false;
    this.generaltermsInfo = false;
  }
}
