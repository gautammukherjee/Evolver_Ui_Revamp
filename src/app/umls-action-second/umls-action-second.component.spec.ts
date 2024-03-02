import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UmlsActionSecondComponent } from './umls-action-second.component';

describe('UmlsActionSecondComponent', () => {
  let component: UmlsActionSecondComponent;
  let fixture: ComponentFixture<UmlsActionSecondComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UmlsActionSecondComponent]
    });
    fixture = TestBed.createComponent(UmlsActionSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
