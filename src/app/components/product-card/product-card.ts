import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/service/cart/cart';
import { Auth } from '../../core/service/auth/auth';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  private authService: Auth = inject(Auth);
  private cartService:CartService = inject(CartService);
  readonly shoppingCartIcon = ShoppingCart;
  /**
   * Formatea la fecha a formato legible
   */
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  get role(){
    return this.authService.role();
  }
  get user() {
    return this.authService.user();
  }
  /**
   * Determina si el stock es bajo
   */
  isLowStock(): boolean {
    return this.product.stock > 0 && this.product.stock < 10;
  }

  /**
   * Determina si el producto está sin stock
   */
  isOutOfStock(): boolean {
    return this.product.stock === 0;
  }

  /**
   * Maneja el click en agregar al carrito
   */
  addToCart(): void {
    if (this.isOutOfStock() || this.isStockExceeded()) {
      console.warn('No puedes agregar más, stock agotado');
      return;
    }
    this.cartService.addItem(this.product);
    console.log('Producto agregado al carrito:', this.product);
  }

  isStockExceeded(): boolean {
    const currentQuantity = this.cartService.getQuantity(this.product.id!);
    return currentQuantity >= this.product.stock;
  }

  /**
   * Obtiene la clase CSS según el estado
   */
  getStatusClass(): string {
    const statusClasses = {
      active: 'bg-green-500',
      inactive: 'bg-red-500',
    };
    return statusClasses[this.product.status];
  }

  /**
   * Traduce el estado al español
   */
  getStatusText(): string {
    const statusText = {
      active: 'Activo',
      inactive: 'Inactivo',
    };
    return statusText[this.product.status];
  }
}
