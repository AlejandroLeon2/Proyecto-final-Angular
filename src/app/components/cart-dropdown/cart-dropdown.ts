// src/app/components/cart-dropdown/cart-dropdown.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/service/cart/cart';
import { CartItem } from '../../core/models/cart-item.model';
import { CartItemComponent } from '../cart-item/cart-item';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [CartItemComponent,CurrencyPipe, LucideAngularModule],
  templateUrl: './cart-dropdown.html',
  styleUrl: './cart-dropdown.css',
})
export class CartDropdown implements OnInit {
  cartItems: CartItem[] = [];
  isDropdownOpen = false;
  totalItems = 0;
  totalPrice = 0;

  shoppingCartIcon = ShoppingCart;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId);
  }

  updateQuantity(itemId: string, newQuantity: number): void {
    this.cartService.updateQuantity(itemId, newQuantity);
  }
  get(){
    this.cartService.saveCart();
  }
}
