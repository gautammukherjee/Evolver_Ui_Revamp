import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSourceNodeLevel3Component } from './filter-source-node-level3.component';

describe('FilterSourceNodeLevel3Component', () => {
  let component: FilterSourceNodeLevel3Component;
  let fixture: ComponentFixture<FilterSourceNodeLevel3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterSourceNodeLevel3Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSourceNodeLevel3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
