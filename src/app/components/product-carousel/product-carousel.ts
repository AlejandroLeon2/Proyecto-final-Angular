import { Component, OnInit, OnDestroy, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { Product } from '../../core/models/product.model';
import { input } from '@angular/core';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './product-carousel.html',
  styleUrl: './product-carousel.css',
})

export class ProductCarouselComponent implements OnInit, OnDestroy {
  // 🆕 Inputs modernos basados en signals
  products = input<Product[]>([]);
  autoPlay = input<boolean>(true);       // ❌ da TS2345
  autoPlayInterval = input<number>(5000); // ❌ da TS2345
  itemsPerView = input<number>(4);

  currentIndex = 0;
  intervalId: any;

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  // ✅ Nuevo Output para comunicar al padre
  @Output() add = new EventEmitter<Product>();

  addToCart(product: Product): void {
    this.add.emit(product); // emite el producto al padre
  }

  ngOnInit(): void {
    if (this.autoPlay() && this.products().length > this.itemsPerView()) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  get maxIndex(): number {
    return Math.max(0, this.products().length - this.itemsPerView());
  }

  get canGoNext(): boolean {
    return this.currentIndex < this.maxIndex;
  }

  get canGoPrev(): boolean {
    return this.currentIndex > 0;
  }

  next(): void {
    if (this.canGoNext) {
      this.currentIndex++;
    } else if (this.autoPlay()) {
      this.currentIndex = 0;
    }
  }

  prev(): void {
    if (this.canGoPrev) {
      this.currentIndex--;
    } else if (this.autoPlay()) {
      this.currentIndex = this.maxIndex;
    }
  }

  get translateX(): string {
    return `translateX(-${(this.currentIndex * 100) / this.itemsPerView()}%)`;
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