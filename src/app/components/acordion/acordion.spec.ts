import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Acordion } from './acordion';

describe('Acordion', () => {
  let component: Acordion;
  let fixture: ComponentFixture<Acordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Acordion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Acordion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
