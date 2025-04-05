import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceDocsComponent } from './compliance-docs.component';

describe('ComplianceDocsComponent', () => {
  let component: ComplianceDocsComponent;
  let fixture: ComponentFixture<ComplianceDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceDocsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
