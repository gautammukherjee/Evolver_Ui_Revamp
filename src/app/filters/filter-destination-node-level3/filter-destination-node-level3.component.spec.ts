import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDestinationNodeLevel3Component } from './filter-destination-node-level3.component';

describe('FilterDestinationNodeLevel3Component', () => {
  let component: FilterDestinationNodeLevel3Component;
  let fixture: ComponentFixture<FilterDestinationNodeLevel3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDestinationNodeLevel3Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDestinationNodeLevel3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
