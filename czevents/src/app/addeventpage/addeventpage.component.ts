import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GetdataService } from '../getdata.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addeventpage',
  templateUrl: './addeventpage.component.html',
  styleUrls: ['./addeventpage.component.css']
})
export class AddeventpageComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private service: GetdataService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      Name: ['', Validators.required],
      Location: ['', Validators.required],
      Date: ['', Validators.required],
      Type: ['', Validators.required],
      Country: ['', Validators.required],
      Description: ['', Validators.required],
      OrganizerEmail: ['', [Validators.required, Validators.email]],
      OrganizerName: ['', Validators.required],
      OrganizerNumber: ['', Validators.required],
      Link: [''],
      Photo: [''],
      priceRange: this.fb.array([this.fb.control('', Validators.required)]) // Initialize with 1 empty price control
    });
  }

  // Getter for priceRange FormArray
  get priceRange(): FormArray {
    return this.eventForm.get('priceRange') as FormArray;
  }

  // Function to add a new price control to the FormArray
  addPrice(): void {
    this.priceRange.push(new FormControl('', Validators.required));
  }

  // Function to remove a price control from the FormArray
  removePrice(index: number): void {
    this.priceRange.removeAt(index);
  }

  @ViewChild('myForm') myForm: ElementRef;

  onSubmit() {
    const formData = new FormData();
    const formElement = this.myForm.nativeElement as HTMLFormElement;
  
    // Retrieve form field values
    const name = (formElement.elements.namedItem('Name') as HTMLInputElement)?.value;
    const location = (formElement.elements.namedItem('Location') as HTMLInputElement)?.value;
    const date = (formElement.elements.namedItem('Date') as HTMLInputElement)?.value;
    const type = (formElement.elements.namedItem('Type') as HTMLInputElement)?.value;
    const country = (formElement.elements.namedItem('Country') as HTMLInputElement)?.value;
    const description = (formElement.elements.namedItem('Description') as HTMLInputElement)?.value;
    const oemail = (formElement.elements.namedItem('OrganizerEmail') as HTMLInputElement)?.value;
    const oname = (formElement.elements.namedItem('OrganizerName') as HTMLInputElement)?.value;
    const onumber = (formElement.elements.namedItem('OrganizerNumber') as HTMLInputElement)?.value;
    const link = (formElement.elements.namedItem('Link') as HTMLInputElement)?.value;
    const photo = (formElement.elements.namedItem('Photo') as HTMLInputElement)?.files[0];
  
    // Append form field values to FormData
    formData.append('Name', name);
    formData.append('Location', location);
    formData.append('Date', date);
    formData.append('Type', type);
    formData.append('Country', country);
    formData.append('Description', description);
    formData.append('OrganizerEmail', oemail);
    formData.append('OrganizerName', oname);
    formData.append('OrganizerNumber', onumber);
    formData.append('Link', link);
    formData.append('Photo', photo);
  
    // Map priceRange values to an object format
    const priceRange = this.priceRange.controls
      .map(control => ({ Price: control.value }))  // Ensure proper object structure
      .filter(priceObj => priceObj.Price !== '');  // Filter out empty prices
  
    formData.append('PriceRange', JSON.stringify(priceRange));
  
    // Send data
    return this.service.sendData(formData).subscribe({
      next: x => {
        window.location.reload();
      },
      error: err => {
        console.error('Error:', err);
      }
    });
  }
  

  logOut() {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("Authentication");
      this.router.navigate(['/AdminLogin']);
    }
  }
}
