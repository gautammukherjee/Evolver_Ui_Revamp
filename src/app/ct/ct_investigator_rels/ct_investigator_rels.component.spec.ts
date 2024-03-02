import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CTInvestigatorRelsComponent } from './ct_investigator_rels.component';

describe('CTInvestigatorRelsComponent', () => {
  let component: CTInvestigatorRelsComponent;
  let fixture: ComponentFixture<CTInvestigatorRelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CTInvestigatorRelsComponent]
    });
    fixture = TestBed.createComponent(CTInvestigatorRelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
