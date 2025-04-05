import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MspDetailsComponent } from './msp-details.component';

describe('MspDetailsComponent', () => {
  let component: MspDetailsComponent;
  let fixture: ComponentFixture<MspDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MspDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MspDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
