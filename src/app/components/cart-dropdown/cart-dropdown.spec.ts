import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartDropdown } from './cart-dropdown';
import { CartItemComponent } from '../cart-item/cart-item';
import { Component } from '@angular/core';

// Mock CartItemComponent
@Component({
  selector: 'app-cart-item',
  template: ''
})
class MockCartItemComponent {
  item: any;
}

describe('CartDropdown', () => {
  let component: CartDropdown;
  let fixture: ComponentFixture<CartDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockCartItemComponent],
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
    expect(component.totalItems).toBe(3);
    expect(component.totalPrice).toBe(30);
  });

  it('should show cart count when items exist', () => {
    component.totalItems = 5;
    fixture.detectChanges();
    
    const cartCount = fixture.nativeElement.querySelector('.cart-count');
    expect(cartCount).toBeTruthy();
    expect(cartCount.textContent).toContain('5');
  });

  it('should hide cart count when no items exist', () => {
    component.totalItems = 0;
    fixture.detectChanges();
    
    const cartCount = fixture.nativeElement.querySelector('.cart-count');
    expect(cartCount).toBeFalsy();
  });

  it('should show empty cart message when no items exist', () => {
    component.isDropdownOpen = true;
    component.cartItems = [];
    fixture.detectChanges();
    
    const emptyMessage = fixture.nativeElement.querySelector('.empty-cart');
    expect(emptyMessage).toBeTruthy();
    expect(emptyMessage.textContent).toContain('Tu carrito está vacío');
  });

  it('should show footer with total when items exist', () => {
    component.isDropdownOpen = true;
    component.cartItems = [
      { id: 1, nombre: 'Test Item', precio: 10, categoria: 'Test', imagen: 'test.jpg', cantidad: 2 }
    ];
    component.calculateTotals();
    fixture.detectChanges();
    
    const footer = fixture.nativeElement.querySelector('.dropdown-footer');
    expect(footer).toBeTruthy();
    expect(footer.querySelector('.total-price').textContent).toContain('20.00');
  });

  it('should not allow updating quantity to less than 1', () => {
    component.cartItems = [
      { id: 1, nombre: 'Test Item', precio: 10, categoria: 'Test', imagen: 'test.jpg', cantidad: 1 }
    ];
    
    component.updateQuantity(1, 0);
    
    expect(component.cartItems[0].cantidad).toBe(1);
  });
});