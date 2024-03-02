import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSubmitComponent } from './filter-submit.component';

describe('FilterSubmitComponent', () => {
  let component: FilterSubmitComponent;
  let fixture: ComponentFixture<FilterSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterSubmitComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
