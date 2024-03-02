import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CTDiseaseAssocComponent } from './ct_disease_assoc.component';

describe('CTDiseaseAssocComponent', () => {
  let component: CTDiseaseAssocComponent;
  let fixture: ComponentFixture<CTDiseaseAssocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CTDiseaseAssocComponent]
    });
    fixture = TestBed.createComponent(CTDiseaseAssocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
