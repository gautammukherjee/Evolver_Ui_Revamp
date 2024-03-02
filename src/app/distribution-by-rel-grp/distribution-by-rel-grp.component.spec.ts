import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionByRelGrpComponent } from './distribution-by-rel-grp.component';

describe('DistributionByRelGrpComponent', () => {
  let component: DistributionByRelGrpComponent;
  let fixture: ComponentFixture<DistributionByRelGrpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistributionByRelGrpComponent]
    });
    fixture = TestBed.createComponent(DistributionByRelGrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
