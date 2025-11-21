import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ckeckout } from './ckeckout';

describe('Ckeckout', () => {
  let component: Ckeckout;
  let fixture: ComponentFixture<Ckeckout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ckeckout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ckeckout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
