import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmidCountWithGeneAndDiseaseComponent } from './pmid-count-with-gene-and-disease.component';

describe('PmidCountWithGeneAndDiseaseComponent', () => {
  let component: PmidCountWithGeneAndDiseaseComponent;
  let fixture: ComponentFixture<PmidCountWithGeneAndDiseaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PmidCountWithGeneAndDiseaseComponent]
    });
    fixture = TestBed.createComponent(PmidCountWithGeneAndDiseaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
