import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredEventsComponent } from './filtered-events.component';

describe('FilteredEventsComponent', () => {
  let component: FilteredEventsComponent;
  let fixture: ComponentFixture<FilteredEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilteredEventsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilteredEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
