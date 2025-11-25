import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVenta } from './modal-venta';

describe('ModalVenta', () => {
  let component: ModalVenta;
  let fixture: ComponentFixture<ModalVenta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVenta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVenta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
