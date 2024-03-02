import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorByCountryComponent } from './investigator-by-country.component';

describe('InvestigatorByCountryComponent', () => {
  let component: InvestigatorByCountryComponent;
  let fixture: ComponentFixture<InvestigatorByCountryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestigatorByCountryComponent]
    });
    fixture = TestBed.createComponent(InvestigatorByCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
