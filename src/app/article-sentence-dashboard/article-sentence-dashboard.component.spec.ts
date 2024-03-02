import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSentenceDashboardComponent } from './article-sentence-dashboard.component';

describe('ArticleSentenceDashboardComponent', () => {
  let component: ArticleSentenceDashboardComponent;
  let fixture: ComponentFixture<ArticleSentenceDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleSentenceDashboardComponent]
    });
    fixture = TestBed.createComponent(ArticleSentenceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
