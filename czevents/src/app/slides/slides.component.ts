import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../getdata.service';

interface Slides{
  Slide: string;
  Link: string;
}

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.css']
})

export class SlidesComponent implements OnInit{
  slides: any= [];
  fullsides: any;

  currentSlideIndex = 0;

  getSlideUrl(index: number): string {
    const slidesCount = this.slides.length;

    if (index < 0) {
      return this.slides[(slidesCount + index) % slidesCount];
    }

    else if (index >= slidesCount) {
      return this.slides[index % slidesCount];
    }

    else {
      return this.slides[index];
    }
  }

  getDisplayedSlides(): any[] {
    const displayedSlides = [];
    for (let i = -1; i <= 1; i++) {
      const index = this.currentSlideIndex + i;
      if (index >= 0 && index < this.slides.length) {
        displayedSlides.push(this.slides[index]);
      }
    }
    return displayedSlides;
  }

  // Other methods and lifecycle hooks if needed


    interval: any;

    constructor(private service: GetdataService) { }



    ngOnInit(): void {
      this.startSlideshow();
      this.service.getSlides().subscribe((response: any) => {
        this.slides = response.$values || [];
        this.slides = this.slides.map(slideObj => slideObj.slide);
        this.fullsides = response.$values
      });

    }

    startSlideshow() {
      this.interval = setInterval(() => {
        this.showNextSlide();
      }, 5000);
    }

    showNextSlide() {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    }

    showPreviousSlide() {
      this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
    }

    ngOnDestroy() {
      clearInterval(this.interval);
    }
}

