import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorStatusUpdateComponent } from './vendor-status-update.component';

describe('VendorStatusUpdateComponent', () => {
  let component: VendorStatusUpdateComponent;
  let fixture: ComponentFixture<VendorStatusUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorStatusUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorStatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
