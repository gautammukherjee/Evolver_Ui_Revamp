import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorByRoleComponent } from './investigator-by-role.component';

describe('InvestigatorByRoleComponent', () => {
  let component: InvestigatorByRoleComponent;
  let fixture: ComponentFixture<InvestigatorByRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestigatorByRoleComponent]
    });
    fixture = TestBed.createComponent(InvestigatorByRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
