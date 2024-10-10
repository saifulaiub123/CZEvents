import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditbannerComponent } from './editbanner.component';

describe('EditbannerComponent', () => {
  let component: EditbannerComponent;
  let fixture: ComponentFixture<EditbannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditbannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
