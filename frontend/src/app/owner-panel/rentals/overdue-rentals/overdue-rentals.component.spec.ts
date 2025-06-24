import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueRentalsComponent } from './overdue-rentals.component';

describe('OverdueRentalsComponent', () => {
  let component: OverdueRentalsComponent;
  let fixture: ComponentFixture<OverdueRentalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverdueRentalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverdueRentalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
