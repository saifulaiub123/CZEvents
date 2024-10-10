import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.css']
})
export class BuyerComponent {
    allInfo: boolean = true;
    eTicketInfo: boolean = false;
    generaltermsInfo: boolean = false;
    buyTicketInfo: boolean = false;
    paymentInfo: boolean = false;
    privacypolicyInfo: boolean = false;

    togglePaymentInfo(paymentInfo: string) {
      this.allInfo = paymentInfo === 'allInfo';
      this.eTicketInfo = paymentInfo === 'eTicketInfo';
      this.generaltermsInfo = paymentInfo === 'generaltermsInfo';
      this.buyTicketInfo = paymentInfo === 'buyTicketInfo';
      this.paymentInfo = paymentInfo === 'paymentInfo';
      this.privacypolicyInfo = paymentInfo === 'privacypolicyInfo';
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
          case 'eticket':
            this.eTicketInfo = true;
            break;
          case 'terms':
            this.generaltermsInfo = true;
            break;
          case 'buy':
            this.buyTicketInfo = true;
            break;
          case 'payment':
            this.paymentInfo = true;
            break;
          case 'privacy':
            this.privacypolicyInfo = true;
            break;
        }
      });
    }

    resetInfo() {
      this.allInfo = false;
      this.eTicketInfo = false;
      this.generaltermsInfo = false;
      this.buyTicketInfo = false;
      this.paymentInfo = false;
      this.privacypolicyInfo = false;
    }
}
