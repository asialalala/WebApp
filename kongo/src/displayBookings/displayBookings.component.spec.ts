import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayBookingsComponent } from './displayBookings.component';

describe('DisplayBookingsComponent', () => {
  let component: DisplayBookingsComponent;
  let fixture: ComponentFixture<DisplayBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayBookingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
