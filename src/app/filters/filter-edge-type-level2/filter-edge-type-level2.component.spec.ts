import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterEdgeTypeLevel2Component } from './filter-edge-type-level2.component';

describe('FilterEdgeTypeLevel2Component', () => {
  let component: FilterEdgeTypeLevel2Component;
  let fixture: ComponentFixture<FilterEdgeTypeLevel2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterEdgeTypeLevel2Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterEdgeTypeLevel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
