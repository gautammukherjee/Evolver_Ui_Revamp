import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSourceNodeComponent } from './filter-source-node.component';

describe('FilterSourceNodeComponent', () => {
  let component: FilterSourceNodeComponent;
  let fixture: ComponentFixture<FilterSourceNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterSourceNodeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSourceNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
