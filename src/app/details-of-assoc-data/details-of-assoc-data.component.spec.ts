import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOfAssocDataComponent } from './details-of-assoc-data.component';

describe('DetailsOfAssocDataComponent', () => {
  let component: DetailsOfAssocDataComponent;
  let fixture: ComponentFixture<DetailsOfAssocDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsOfAssocDataComponent]
    });
    fixture = TestBed.createComponent(DetailsOfAssocDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
