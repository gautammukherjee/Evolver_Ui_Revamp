import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDestinationNodeLevel2Component } from './filter-destination-node-level2.component';

describe('FilterDestinationNodeLevel2Component', () => {
  let component: FilterDestinationNodeLevel2Component;
  let fixture: ComponentFixture<FilterDestinationNodeLevel2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDestinationNodeLevel2Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDestinationNodeLevel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
