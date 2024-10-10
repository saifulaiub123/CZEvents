import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LabelType, Options } from '@angular-slider/ngx-slider'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-filternav',
  templateUrl: './filternav.component.html',
  styleUrls: ['./filternav.component.css']
})

export class FilternavComponent implements OnInit{
  hideFilters: boolean = false; // By default, filters are visible
  @Output() hideFiltersChange = new EventEmitter<boolean>();

  
  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([`(max-width: 768px)`])
      .subscribe(result => {
        if (result.matches) {
          this.hideFilters = true;
        } else {
          this.hideFilters = false;
        }
      });
  }

  toggleFilters(event: any): void {
    this.hideFilters = !event.target.checked;
  }

  
  minValue: number = 50;
  maxValue: number = 2000;
  options: Options = {
    floor: 0,
    ceil: 2000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + " Kč";
        case LabelType.High:
          return value + " Kč";
        default:
          return value + " Kč";
      }
    }
  };

}
