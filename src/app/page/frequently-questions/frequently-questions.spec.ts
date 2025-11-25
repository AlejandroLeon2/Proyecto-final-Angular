import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequentlyQuestions } from './frequently-questions';

describe('FrequentlyQuestions', () => {
  let component: FrequentlyQuestions;
  let fixture: ComponentFixture<FrequentlyQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrequentlyQuestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrequentlyQuestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
