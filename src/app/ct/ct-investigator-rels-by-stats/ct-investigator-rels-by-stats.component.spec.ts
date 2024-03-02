import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtInvestigatorRelsByStatsComponent } from './ct-investigator-rels-by-stats.component';

describe('CtInvestigatorRelsByStatsComponent', () => {
  let component: CtInvestigatorRelsByStatsComponent;
  let fixture: ComponentFixture<CtInvestigatorRelsByStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CtInvestigatorRelsByStatsComponent]
    });
    fixture = TestBed.createComponent(CtInvestigatorRelsByStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
