import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterEdgeTypeLevel3Component } from './filter-edge-type-level3.component';

describe('FilterEdgeTypeLevel3Component', () => {
  let component: FilterEdgeTypeLevel3Component;
  let fixture: ComponentFixture<FilterEdgeTypeLevel3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterEdgeTypeLevel3Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterEdgeTypeLevel3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
