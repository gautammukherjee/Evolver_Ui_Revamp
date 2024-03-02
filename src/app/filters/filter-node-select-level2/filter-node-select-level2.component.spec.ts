import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterNodeSelectLevel2Component } from './filter-node-select-level2.component';

describe('FilterNodeSelectLevel2Component', () => {
  let component: FilterNodeSelectLevel2Component;
  let fixture: ComponentFixture<FilterNodeSelectLevel2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterNodeSelectLevel2Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNodeSelectLevel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
