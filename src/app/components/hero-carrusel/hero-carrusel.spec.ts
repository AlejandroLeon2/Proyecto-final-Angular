import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCarrusel } from './hero-carrusel';

describe('HeroCarrusel', () => {
  let component: HeroCarrusel;
  let fixture: ComponentFixture<HeroCarrusel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroCarrusel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroCarrusel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
