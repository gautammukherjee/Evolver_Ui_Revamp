import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmidSearchComponent } from './pmid-search.component';

describe('PmidSearchComponent', () => {
  let component: PmidSearchComponent;
  let fixture: ComponentFixture<PmidSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PmidSearchComponent]
    });
    fixture = TestBed.createComponent(PmidSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
