import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ProductCarouselComponent } from '../../components/product-carousel/product-carousel';
import { ProductsService } from '../../core/service/products/products';
import { HeroCarrusel } from '../../components/hero-carrusel/hero-carrusel';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { LucideAngularModule,ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCarouselComponent, HeroCarrusel, RouterLink,LucideAngularModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  readonly ChevronRight =ChevronRight
  private productsService = inject(ProductsService);
    news = toSignal(
    this.productsService.getPaginatedProducts(1, 10, []).pipe(
      map(res => res.products)
    ),
    { initialValue: [] }
  );

  accesorios = toSignal(
    this.productsService.getPaginatedProducts(1, 10, ['aqZaXgyFq6OZ7lNnymWx']).pipe(
      map(res => res.products)
    ),
    { initialValue: [] }
  );

  electronica = toSignal(
    this.productsService.getPaginatedProducts(1, 10, ['wLBs909cKQXBFXIpofUK']).pipe(
      map(res => res.products)
    ),
    { initialValue: [] }
  );

  moda = toSignal(
    this.productsService.getPaginatedProducts(1, 10, ['UF1hU19ETzH3GUaeUo77']).pipe(
      map(res => res.products)
    ),
    { initialValue: [] }
  );
}
