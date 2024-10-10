import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilternavComponent } from './filternav.component';

describe('FilternavComponent', () => {
  let component: FilternavComponent;
  let fixture: ComponentFixture<FilternavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilternavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilternavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
