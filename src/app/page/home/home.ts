import { CommonModule } from '@angular/common';
import { Component, OnInit, inject} from '@angular/core';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ProductsService } from '../../core/service/products/products';
import { HeroCarrusel } from '../../components/hero-carrusel/hero-carrusel';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, HeroCarrusel, RouterLink],
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
