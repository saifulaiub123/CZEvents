import { Component, ElementRef, ViewChild } from '@angular/core';
import { EventFilterService } from '../event-filter.service';
import { GetdataService } from '../getdata.service';
import { ActivatedRoute, Router } from '@angular/router';

interface LoginResponse {
  token: string;
  // Other properties if there are any
}

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})

export class AdminloginComponent {
  constructor(private getservice: GetdataService, private route: ActivatedRoute, private router: Router){}

  

  @ViewChild('myForm') myForm: ElementRef;

  login(){
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    const formData = new FormData();
    const formElement = this.myForm.nativeElement as HTMLFormElement;

    // Retrieve form field values
    const email = (formElement.elements.namedItem('Email') as HTMLInputElement)?.value;
    const password = (formElement.elements.namedItem('Password') as HTMLInputElement)?.value;

    // Append form field values to FormData
    formData.append('Email', email);
    formData.append('Password', password);
    

    return this.getservice.login(formData).subscribe((x: LoginResponse) => {
      localStorage.setItem("Authentication", x.token);
      this.router.navigate(['/Admin']);
    });
}
}
