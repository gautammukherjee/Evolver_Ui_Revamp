import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftFilterLayoutComponent } from './left-filter-layout.component';

describe('LeftFilterLayoutComponent', () => {
  let component: LeftFilterLayoutComponent;
  let fixture: ComponentFixture<LeftFilterLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftFilterLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeftFilterLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
