import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSourceNodeLevel2Component } from './filter-source-node-level2.component';

describe('FilterSourceNodeLevel2Component', () => {
  let component: FilterSourceNodeLevel2Component;
  let fixture: ComponentFixture<FilterSourceNodeLevel2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterSourceNodeLevel2Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSourceNodeLevel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
