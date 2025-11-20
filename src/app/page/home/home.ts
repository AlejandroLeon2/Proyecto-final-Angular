import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/service/productData';
import { HeroCarrusel } from '../../components/hero-carrusel/hero-carrusel';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, HeroCarrusel,RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  featuredProducts: Product[] = [];

  constructor(private productService: ProductService) {} // 👈 Inyectar el servicio

 ngOnInit(): void {
  this.productService.getProducts().subscribe({
    next: (products) => {
      this.featuredProducts = products.slice(0, 8); // 👈 aquí seleccionas los destacados
      console.log('Productos cargados:', this.featuredProducts.length);
    },
    error: (error) => {
      console.error('Error al cargar productos:', error);
    },
  });
}

}
