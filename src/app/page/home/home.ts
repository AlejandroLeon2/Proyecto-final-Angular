import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { Product } from '../../core/models/product.interface';
import { ProductService } from '../../core/service/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  featuredProducts: Product[] = [];

  constructor(private productService: ProductService) {} // 👈 Inyectar el servicio

  ngOnInit(): void {
    // Cargar productos usando el servicio
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products;
        console.log('Productos cargados:', this.featuredProducts.length);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      },
    });
  }
}
