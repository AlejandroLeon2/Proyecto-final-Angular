import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../core/service/cart/cart';
import { CartItem } from '../../core/models/cart-item.model';
import { CartItemComponent } from '../cart-item/cart-item';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';

@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [CommonModule, CartItemComponent, LucideAngularModule],
  templateUrl: './cart-dropdown.html',
  styleUrl: './cart-dropdown.css',
})
export class CartDropdown implements OnInit {
  @Input() isFullPage = false;

  cartItems: CartItem[] = [];
  isDropdownOpen = false;
  totalItems = 0;
  totalPrice = 0;

  shoppingCartIcon = ShoppingCart;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotals();

      if (this.isFullPage) {
        this.isDropdownOpen = true;
      }
    });
  }

  calculateTotals(): void {
    this.totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  toggleDropdown(): void {
    if (this.isFullPage) return;
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId);
  }

  updateQuantity(itemId: string, newQuantity: number): void {
    this.cartService.updateQuantity(itemId, newQuantity);
  }

  goToCartPage() {
        this.cartService.saveCart();
    this.router.navigate(['/shop/cart']);
  }

  finalizePurchase() {
    this.router.navigate(['/shop/ckeckout']);
  }

  continueShopping() {
    this.router.navigate(['/shop']);
  }
}
