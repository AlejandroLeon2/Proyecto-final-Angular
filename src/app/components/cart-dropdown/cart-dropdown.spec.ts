import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartDropdown } from './cart-dropdown';

describe('CartDropdown', () => {
  let component: CartDropdown;
  let fixture: ComponentFixture<CartDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown visibility', () => {
    expect(component.isDropdownOpen).toBeFalse();
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBeTrue();
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBeFalse();
  });

  it('should calculate totals correctly', () => {
    component.cartItems = [
      { id: 1, nombre: 'Test Item', precio: 10, categoria: 'Test', imagen: 'test.jpg', cantidad: 2 },
      { id: 2, nombre: 'Test Item 2', precio: 15, categoria: 'Test', imagen: 'test2.jpg', cantidad: 1 }
    ];
    
    component.calculateTotals();
    
    expect(component.totalItems).toBe(3);
    expect(component.totalPrice).toBe(35);
  });

  it('should remove item from cart', () => {
    component.cartItems = [
      { id: 1, nombre: 'Test Item', precio: 10, categoria: 'Test', imagen: 'test.jpg', cantidad: 1 }
    ];
    
    component.removeItem(1);
    
    expect(component.cartItems.length).toBe(0);
  });

  it('should update quantity', () => {
    component.cartItems = [
      { id: 1, nombre: 'Test Item', precio: 10, categoria: 'Test', imagen: 'test.jpg', cantidad: 1 }
    ];
    
    component.updateQuantity(1, 3);
    
    expect(component.cartItems[0].cantidad).toBe(3);
  });
});