import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, effect} from '@angular/core';
import { ProductCarouselComponent } from '../../components/product-carousel/product-carousel'; 
import { ProductsService } from '../../core/service/products/products';
import { HeroCarrusel } from '../../components/hero-carrusel/hero-carrusel';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCarouselComponent,HeroCarrusel, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  private productsService = inject(ProductsService);
  featuredProducts = this.productsService['_data'];

  ngOnInit(): void {
    this.productsService.getProducts();
  }
}
