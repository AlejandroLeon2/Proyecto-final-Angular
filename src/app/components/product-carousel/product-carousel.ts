import { Component, Input, OnInit, OnDestroy, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './product-carousel.html',
  styleUrl: './product-carousel.css',
})

export class ProductCarouselComponent implements OnInit, OnDestroy {
  // 🛒 Inputs configurables
  @Input() products: Product[] = [];
  @Input() autoPlay: boolean = true;
  @Input() autoPlayInterval: number = 5000;
  @Input() itemsPerView: number = 4;

  currentIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    if (this.autoPlay && this.products.length > this.itemsPerView) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  // 🔹 Cálculos del carrusel
  get maxIndex(): number {
    return Math.max(0, this.products.length - this.itemsPerView);
  }

  get canGoNext(): boolean {
    return this.currentIndex < this.maxIndex;
  }

  get canGoPrev(): boolean {
    return this.currentIndex > 0;
  }

  get visibleProducts(): Product[] {
    return this.products.slice(this.currentIndex, this.currentIndex + this.itemsPerView);
  }

  // 🔹 Navegación
  next(): void {
    if (this.canGoNext) {
      this.currentIndex++;
    } else if (this.autoPlay) {
      this.currentIndex = 0; // Reiniciar al inicio
    }
  }

  prev(): void {
    if (this.canGoPrev) {
      this.currentIndex--;
    } else if (this.autoPlay) {
      this.currentIndex = this.maxIndex; // Ir al final
    }
  }

  goToSlide(index: number): void {
    if (index >= 0 && index <= this.maxIndex) {
      this.currentIndex = index;
    }
  }

  // 🔹 Reproducción automática
  startAutoPlay(): void {
    this.intervalId = setInterval(() => this.next(), this.autoPlayInterval);
  }

  stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onMouseEnter(): void {
    if (this.autoPlay) {
      this.stopAutoPlay();
    }
  }

  onMouseLeave(): void {
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  // 🔹 Indicadores (puntos del carrusel)
  get navigationDots(): number[] {
    const dotsCount = Math.ceil(this.products.length / this.itemsPerView);
    return Array(dotsCount).fill(0).map((_, i) => i);
  }

  get currentDot(): number {
    return Math.floor(this.currentIndex / this.itemsPerView);
  }

  get translateX(): string {
  return `translateX(-${(this.currentIndex * 100) / this.itemsPerView}%)`;
}

}