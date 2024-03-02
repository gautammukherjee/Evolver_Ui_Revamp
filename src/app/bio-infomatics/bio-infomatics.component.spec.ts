import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioInfomaticsComponent } from './bio-infomatics.component';

describe('BioInfomaticsComponent', () => {
  let component: BioInfomaticsComponent;
  let fixture: ComponentFixture<BioInfomaticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BioInfomaticsComponent]
    });
    fixture = TestBed.createComponent(BioInfomaticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
