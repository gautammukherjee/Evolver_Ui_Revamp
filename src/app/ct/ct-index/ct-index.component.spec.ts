import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtIndexComponent } from './ct-index.component';

describe('CtIndexComponent', () => {
  let component: CtIndexComponent;
  let fixture: ComponentFixture<CtIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CtIndexComponent]
    });
    fixture = TestBed.createComponent(CtIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
