import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDestinationNodeComponent } from './filter-destination-node.component';

describe('FilterDestinationNodeComponent', () => {
  let component: FilterDestinationNodeComponent;
  let fixture: ComponentFixture<FilterDestinationNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDestinationNodeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDestinationNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
