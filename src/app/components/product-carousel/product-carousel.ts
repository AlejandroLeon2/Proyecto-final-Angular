import { Component, OnInit, OnDestroy, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { Product } from '../../core/models/product.model';
import { input, signal, computed } from '@angular/core';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './product-carousel.html',
  styleUrl: './product-carousel.css',
})
export class ProductCarouselComponent implements OnInit, OnDestroy {
  products = input<Product[]>([]);
  autoPlay = input<boolean>(true);
  autoPlayInterval = input<number>(5000);
  itemsPerView = input<number>(4);

  currentIndex = signal(0);
  intervalId: any;

  // 🆕 Items visibles responsive
  visibleItems = signal(4);

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  @Output() add = new EventEmitter<Product>();

  // 🆕 Detectar cambios de tamaño de ventana
  @HostListener('window:resize')
  onResize() {
    this.updateVisibleItems();
    // Ajustar índice si queda fuera de rango
    if (this.currentIndex() > this.maxIndex) {
      this.currentIndex.set(this.maxIndex);
    }
  }

  ngOnInit(): void {
    this.updateVisibleItems();
    if (this.autoPlay() && this.products().length > this.visibleItems()) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  // 🆕 Actualizar items visibles según el ancho de pantalla
  private updateVisibleItems(): void {
    const width = window.innerWidth;
    if (width <= 600) {
      this.visibleItems.set(1);
    } else if (width <= 992) {
      this.visibleItems.set(2);
    } else if (width <= 1400) {
      this.visibleItems.set(3);
    } else {
      this.visibleItems.set(this.itemsPerView());
    }
  }

  get maxIndex(): number {
    return Math.max(0, this.products().length - this.visibleItems());
  }

  get canGoNext(): boolean {
    return this.currentIndex() < this.maxIndex;
  }

  get canGoPrev(): boolean {
    return this.currentIndex() > 0;
  }

  next(): void {
    if (this.canGoNext) {
      this.currentIndex.update(i => i + 1);
    } else if (this.autoPlay()) {
      this.currentIndex.set(0);
    }
  }

  prev(): void {
    if (this.canGoPrev) {
      this.currentIndex.update(i => i - 1);
    } else if (this.autoPlay()) {
      this.currentIndex.set(this.maxIndex);
    }
  }

  // 🔧 CORREGIDO: Cálculo correcto del desplazamiento
  get translateX(): string {
    const percentage = (this.currentIndex() * 100) / this.visibleItems();
    return `translateX(-${percentage}%)`;
  }

  // 🆕 Ancho dinámico para cada card (usado en el template)
  get cardWidth(): string {
    return `calc(100% / ${this.visibleItems()})`;
  }

  addToCart(product: Product): void {
    this.add.emit(product);
  }

  startAutoPlay(): void {
    this.intervalId = setInterval(() => this.next(), this.autoPlayInterval());
  }

  stopAutoPlay(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  onMouseEnter(): void {
    if (this.autoPlay()) this.stopAutoPlay();
  }

  onMouseLeave(): void {
    if (this.autoPlay()) this.startAutoPlay();
  }
}