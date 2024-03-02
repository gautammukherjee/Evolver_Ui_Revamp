import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NctInvestigatorNameComponent } from './nct-investigator-name.component';

describe('NctInvestigatorNameComponent', () => {
  let component: NctInvestigatorNameComponent;
  let fixture: ComponentFixture<NctInvestigatorNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NctInvestigatorNameComponent]
    });
    fixture = TestBed.createComponent(NctInvestigatorNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
