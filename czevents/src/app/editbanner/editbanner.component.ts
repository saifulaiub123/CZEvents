import { Component, ElementRef, ViewChild } from '@angular/core';
import { GetdataService } from '../getdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editbanner',
  templateUrl: './editbanner.component.html',
  styleUrls: ['./editbanner.component.css']
})
export class EditbannerComponent {
  constructor(private service: GetdataService, private router: Router){
    this.getSlides();
  }

  @ViewChild('myForm') myForm: ElementRef;

  slides: any[];

  getSlides(){
    return this.service.getSlides().subscribe((x: any )=> {
      this.slides = x.$values;
    })
  }
  onSubmit() {
    const formData = new FormData();
    const formElement = this.myForm.nativeElement as HTMLFormElement;

    // Retrieve form field values
    const slide = (formElement.elements.namedItem('Slide') as HTMLInputElement)?.files[0];;
    const link = (formElement.elements.namedItem('Link') as HTMLInputElement)?.value;

    // Append form field values to FormData
    formData.append('Slide', slide);
    formData.append('Link', link);

    return this.service.addslide(formData).subscribe(x => {
      window.location.reload();
    });
  }
  confirmDelete(id: number) {
    if (confirm("Are you sure you want to delete this image?")) {
        this.service.deleteSlide(id).subscribe(x => window.location.reload());
    }
    window.location.reload();
}
logOut(){
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("Authentication");
    this.router.navigate(['/AdminLogin']);
  }
}
}
