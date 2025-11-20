// import { Component, OnInit, signal } from '@angular/core';
// import { FilterComponent, FilterState } from '../../components/filter/filter';
// import { Product } from '../../core/models/product.model';
// import { ProductService } from '../../core/service/productData';

// @Component({
//   selector: 'app-product-catalog',
//   imports: [FilterComponent],
//   standalone: true,
//   templateUrl: './product-catalog.html',
//   styleUrl: './product-catalog.css',
// })
// export class ProductCatalog implements OnInit {
//   products = signal<Product[]>([]);
//   filteredProducts = signal<Product[]>([]);
//   currentFilters = signal<FilterState>({
//     categories: [],
//   });

//   constructor(private productService: ProductService) {}

//   ngOnInit(): void {
//     this.loadProducts();
//   }

//   loadProducts(): void {
//     this.productService.getProducts().subscribe({
//       next: (products) => {
//         this.products.set(products);
//         this.filteredProducts.set(products);
//       },
//       error: (error) => {
//         console.error('Error loading products:', error);
//       },
//     });
//   }

//   onFilterChange(filters: FilterState): void {
//     this.currentFilters.set(filters);
//     this.applyFilters();
//   }

//   private applyFilters(): void {
//     const filters = this.currentFilters();
//     let filtered = [...this.products()];

//     // Filtrar por categorías
//     if (filters.categories.length > 0) {
//       filtered = filtered.filter((product) =>
//         filters.categories.includes(product.category)
//       );
//     }

//     this.filteredProducts.set(filtered);
//   }
// }

import { Component, inject, OnInit, signal } from '@angular/core';
import { FilterComponent, FilterState } from '../../components/filter/filter';
import { ProductCardComponent } from '../../components/product-card/product-card'; // Ajusta la ruta si es necesario
import { Pagination } from '../../components/pagination/pagination';
import { Product } from '../../core/models/product.model';

import { ProductService } from '../../core/service/productData';

import { ProductsService } from '../../core/service/products/products'; // Usamos el servicio actualizado

@Component({
  selector: 'app-product-catalog',

  standalone: true,
  imports: [FilterComponent, ProductCardComponent, Pagination],
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.css',
})
export class ProductCatalog implements OnInit {
  private productsService = inject(ProductsService);

  // --- Signals de Estado ---
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  
  // Estado de Paginación
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);
  itemsPerPage = 1; // Configurable

  // Estado de Filtros (Nota: El backend aun no filtra, pero mantenemos el estado)
  currentFilters = signal<FilterState>({ categories: [] });

  ngOnInit(): void {
    this.loadPaginatedProducts();
  }

  loadPaginatedProducts(): void {
    this.loading.set(true);
    
    // Efecto: Cuando cambia currentPage, llamamos al servicio
    this.productsService
      .getPaginatedProducts(this.currentPage(), this.itemsPerPage)
      .subscribe({
        next: (data) => {
          this.products.set(data.products);
          this.totalPages.set(data.pagination.totalPages);
          this.totalItems.set(data.pagination.totalItems);
          this.loading.set(false);
          
          // Scroll al inicio suavemente cuando cambie la página
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => {
          console.error('Error cargando productos paginados:', err);
          this.loading.set(false);
        }
      });
  }

  // Este método se conecta con el output (filterChange) del componente Filter
  onFilterChange(filters: FilterState): void {
    this.currentFilters.set(filters);
    // IMPORTANTE: Como el backend actual no soporta filtros en el endpoint paginado,
    // aquí deberíamos implementar la lógica. Por ahora, reseteamos a página 1 
    // para recargar (aunque traerá datos sin filtrar hasta que se actualice el backend).
    this.currentPage.set(1);
    this.loadPaginatedProducts();
  }

  // Método para capturar el cambio de página desde el componente Pagination
  onPageChange(newPage: number): void {
    this.currentPage.set(newPage);
    this.loadPaginatedProducts();
  }
}