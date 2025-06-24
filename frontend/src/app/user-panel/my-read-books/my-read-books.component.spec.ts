import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReadBooksComponent } from './my-read-books.component';

describe('MyReadBooksComponent', () => {
  let component: MyReadBooksComponent;
  let fixture: ComponentFixture<MyReadBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyReadBooksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyReadBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
