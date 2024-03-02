import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionByRelationTypeComponent } from './distribution-by-relation-type.component';

describe('DistributionByRelationTypeComponent', () => {
  let component: DistributionByRelationTypeComponent;
  let fixture: ComponentFixture<DistributionByRelationTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DistributionByRelationTypeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionByRelationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
