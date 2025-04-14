import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestPopupComponent } from './change-request-popup.component';

describe('ChangeRequestPopupComponent', () => {
  let component: ChangeRequestPopupComponent;
  let fixture: ComponentFixture<ChangeRequestPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
