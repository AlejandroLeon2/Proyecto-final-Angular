import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Minus, Plus, ShoppingCart } from 'lucide-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../core/models/product.model';
import { ProductsService } from '../../core/service/products/products';
import { CartService } from '../../core/service/cart/cart';
import { ProductCarouselComponent } from '../../components/product-carousel/product-carousel';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Auth } from '../../core/service/auth/auth';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ProductCarouselComponent, RouterLink],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
})
export class ProductDetail implements OnInit, OnDestroy {
  product: Product | null = null;
  quantity: number = 1;
  isLoading: boolean = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  Plus = Plus;
  Minus = Minus;
  shoppingCartIcon = ShoppingCart;
  private productsService = inject(ProductsService);
  private authService:Auth = inject(Auth);
  featuredProducts = this.productsService['_data'];
  constructor(
    private route: ActivatedRoute,
    private router: Router,

    private location: Location,
    private cartService: CartService
  ) {}
  get user() {
    return this.authService.user();
  }
  news = toSignal(
    this.productsService.getPaginatedProducts(1, 10, []).pipe(map((res) => res.products)),
    { initialValue: [] }
  );

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
    this.productsService.getProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.error = null;

    if (!id) {
      this.error = 'ID de producto inválido';
      this.isLoading = false;
      return;
    }

    this.productsService
      .getProductById(id)
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

    this.cartService.addItem(this.product, this.quantity);

    console.log('🛒 Producto añadido:', {
      id: this.product.id,
      quantity: this.quantity,
    });
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
