import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/service/productData';
import { CATEGORIES } from '../../core/constants/categories';
import { LucideAngularModule, Plus, Minus, ShoppingCart } from 'lucide-angular';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
})
export class ProductDetail implements OnInit, OnDestroy {
  product: Product | null = null;
  quantity: number = 1;
  isLoading: boolean = true;
  error: string | null = null;
  CATEGORIES = CATEGORIES;
  private destroy$ = new Subject<void>();

  Plus = Plus;
  Minus = Minus;
  shoppingCartIcon = ShoppingCart;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(id: string | number): void {
    this.isLoading = true;
    this.error = null;

    const numericId = Number(id);
    if (isNaN(numericId)) {
      this.error = 'ID de producto inválido';
      this.isLoading = false;
      return;
    }

    this.productService
      .getProductById(numericId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product) => {
          this.product = product ?? null;
          if (this.product && this.product.stock < this.quantity) {
            this.quantity = this.product.stock > 0 ? this.product.stock : 1;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar el producto:', err);
          this.error = 'No se pudo cargar el producto. Intenta más tarde.';
          this.isLoading = false;
        },
      });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  isOutOfStock(): boolean {
    return this.product?.stock === 0;
  }

  isLowStock(): boolean {
    if (!this.product) return false;
    return this.product.stock > 0 && this.product.stock < 10;
  }

  addToCart(): void {
    if (!this.product || this.isOutOfStock()) return;

    const cartItem = {
      product: this.product,
      quantity: this.quantity,
    };

    console.log('✅ Agregado al carrito:', cartItem);
    // TODO: Conectar con CartService
  }

  goBack(): void {
    this.location.back();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  }
}
