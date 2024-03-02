import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterNodeSelectLevel3Component } from './filter-node-select-level3.component';

describe('FilterNodeSelectLevel3Component', () => {
  let component: FilterNodeSelectLevel3Component;
  let fixture: ComponentFixture<FilterNodeSelectLevel3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterNodeSelectLevel3Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNodeSelectLevel3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
