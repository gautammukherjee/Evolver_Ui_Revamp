import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterNodeSelectComponent } from './filter-node-select.component';

describe('FilterNodeSelectComponent', () => {
  let component: FilterNodeSelectComponent;
  let fixture: ComponentFixture<FilterNodeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterNodeSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNodeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
