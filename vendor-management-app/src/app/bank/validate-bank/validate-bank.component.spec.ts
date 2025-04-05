import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateBankComponent } from './validate-bank.component';

describe('ValidateBankComponent', () => {
  let component: ValidateBankComponent;
  let fixture: ComponentFixture<ValidateBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
