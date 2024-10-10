import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetdataService } from '../getdata.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { identifierName } from '@angular/compiler';

@Component({
  selector: 'app-eventedit',
  templateUrl: './eventedit.component.html',
  styleUrls: ['./eventedit.component.css']
})
export class EventeditComponent {
  Event: any;
  selectedCountry: string = '';
  selectedType: string = '';

  constructor(private route: ActivatedRoute, private getservice: GetdataService, private router: Router) {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.getservice.getEvent(id).subscribe(x => console.log(x));
  }

  ngOnInit(): void {
    this.getEvent();
  }

  getEvent(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.getservice.getEvent(id).subscribe(event => {
      this.Event = event;
      this.selectedCountry = this.Event.country;
      this.selectedType = this.Event.type; 
    });
  }
  
  @ViewChild('myForm') myForm: ElementRef;

  updateEvent(){
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    const formData = new FormData();
    const formElement = this.myForm.nativeElement as HTMLFormElement;

    // Retrieve form field values
    const name = (formElement.elements.namedItem('Name') as HTMLInputElement)?.value;
    const location = (formElement.elements.namedItem('Location') as HTMLInputElement)?.value;
    const date = (formElement.elements.namedItem('Date') as HTMLInputElement)?.value;
    const price = (formElement.elements.namedItem('Price') as HTMLInputElement)?.value;
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
    formData.append('Price', price);
    formData.append('Type', type);
    formData.append('Country', country);
    formData.append('Description', description);
    formData.append('OrganizerEmail', oemail);
    formData.append('OrganizerName', oname);
    formData.append('OrganizerNumber', onumber);
    formData.append('Photo', photo);
    formData.append('Link', link);
    formData.append('Photo', photo);

    return this.getservice.updateEvent(id, formData).subscribe(x => {
      console.log(x)
      window.location.reload()
    });
}

confirmDelete(): void {
  if (confirm("Are you sure you want to delete this event?")) {
    this.deleteEvent();
  }
}

deleteEvent(): void {
  const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
  this.getservice.deleteEvent(id).subscribe(
    () => {
      alert('Event deleted successfully.');
      // Optionally, redirect or update UI
    },
    error => {
      console.error('Error deleting event:', error);
      // Handle error, display error message, etc.
    }
  );
}
logOut(){
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("Authentication")
    this.router.navigate(['/AdminLogin']);
  }
}
} 
