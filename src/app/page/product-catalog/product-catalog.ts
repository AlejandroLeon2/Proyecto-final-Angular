import { Component, OnInit, signal } from '@angular/core';
import { FilterComponent, FilterState } from '../../components/filter/filter';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/service/productData';
import { ProductCardComponent } from '../../components/product-card/product-card';

@Component({
  selector: 'app-product-catalog',
  imports: [FilterComponent,ProductCardComponent],
  standalone: true,
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.css',
})
export class ProductCatalog implements OnInit {
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  currentFilters = signal<FilterState>({
    categories: [],
  });

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.filteredProducts.set(products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }

  onFilterChange(filters: FilterState): void {
    this.currentFilters.set(filters);
    this.applyFilters();
  }

  private applyFilters(): void {
    const filters = this.currentFilters();
    let filtered = [...this.products()];

    // Filtrar por categorías
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    this.filteredProducts.set(filtered);
  }
}