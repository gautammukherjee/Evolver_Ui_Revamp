import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterEdgeTypeComponent } from './filter-edge-type.component';

describe('FilterEdgeTypeComponent', () => {
  let component: FilterEdgeTypeComponent;
  let fixture: ComponentFixture<FilterEdgeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterEdgeTypeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterEdgeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
