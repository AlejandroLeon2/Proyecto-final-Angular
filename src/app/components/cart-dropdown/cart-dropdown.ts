import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  cantidad: number;
}

@Component({
  selector: 'app-cart-dropdown',
  imports: [CommonModule],
  templateUrl: './cart-dropdown.html',
  styleUrl: './cart-dropdown.css',
})
export class CartDropdown {
  cartItems: CartItem[] = [];
  isDropdownOpen = false;
  totalItems = 0;
  totalPrice = 0;

  constructor() {
    this.loadCartData();
  }

  private loadCartData(): void {
    fetch('data/carrito-compras.json')
      .then(response => response.json())
      .then(data => {
        this.cartItems = data;
        this.calculateTotals();
      })
      .catch(error => console.error('Error loading cart data:', error));
  }

  calculateTotals(): void {
    this.totalItems = this.cartItems.reduce((sum, item) => sum + item.cantidad, 0);
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  removeItem(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.calculateTotals();
  }

  updateQuantity(itemId: number, newQuantity: number): void {
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].id === itemId) {
        if (newQuantity > 0) {
          this.cartItems[i].cantidad = newQuantity;
          this.calculateTotals();
        }
        break;
      }
    }
  }
}