import { Component, inject, OnInit, signal } from '@angular/core';
import { FilterComponent, FilterState } from '../../components/filter/filter';
import { ProductCardComponent } from '../../components/product-card/product-card'; // Ajusta la ruta si es necesario
import { Pagination } from '../../components/pagination/pagination';
import { Product } from '../../core/models/product.model';
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
  itemsPerPage = 12; // Configurable

  // <--- CAMBIO: Estado local de filtros --->
  currentFilters = signal<FilterState>({ categories: [] });

  //variable para search
  wordSearch: string = '';
 
  ngOnInit(): void {
    this.loadWordSearch();
    this.loadPaginatedProducts();
  }

  loadWordSearch(): void {
    this.wordSearch = localStorage.getItem('searchWord') || '';
  }

  // se altero el metodo para incluir filtros del buscador
  loadPaginatedProducts(): void {
    this.loading.set(true);

    //varificamos si existe wordSearch para hacer la busqueda con getPSearchProducts o con getPaginatedProducts

    // <--- CAMBIO: Obtenemos los filtros actuales --->
    const filters = this.currentFilters();
    
    const actionGetProducts = this.wordSearch
      ? this.productsService.getPSearchProducts(this.currentPage(), this.itemsPerPage, this.wordSearch, filters.categories)
      : this.productsService.getPaginatedProducts(this.currentPage(), this.itemsPerPage, filters.categories);
    // Efecto: Cuando cambia currentPage, llamamos al servicio
    actionGetProducts
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
          this.products = signal<Product[]>([]);
          console.error('Error loading products:', err);
          this.loading.set(false);
        }
      });
  }

  // Este método se conecta con el output (filterChange) del componente Filter
  onFilterChange(filters: FilterState): void {
    this.currentFilters.set(filters);
    this.currentPage.set(1);
    this.loadPaginatedProducts();
  }

  // Método para capturar el cambio de página desde el componente Pagination
  onPageChange(newPage: number): void {
    this.currentPage.set(newPage);
    this.loadPaginatedProducts();
  }

  refreshCatalogo():void{
    this.wordSearch = ``;
    this.loadPaginatedProducts();
  }
}