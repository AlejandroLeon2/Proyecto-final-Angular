import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
})
export class ProductCardComponent {
  @Input() product!: Product; // Recibe el producto del componente padre

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
    if (this.isOutOfStock()) return;

    // Aquí implementarás la lógica del carrito
    console.log('Producto agregado al carrito:', this.product);
    // Ejemplo: this.cartService.addItem(this.product);
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
