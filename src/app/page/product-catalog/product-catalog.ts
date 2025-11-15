// 1. Importamos 'effect'
import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Pagination } from '../../components/pagination/pagination';
import * as allProductsData from '../../../data/products.json';
import { Product } from '../../core/models/product';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, Pagination, NgOptimizedImage],
  templateUrl: './product-catalog.html',
})
export class ProductCatalog {
  private itemsPerPage = 12; // --- SIGNALS DE ESTADO ---

  public currentPage = signal(1); // El estado sigue viviendo aquí
  private allProducts = signal<Product[]>((allProductsData as any).default || allProductsData); // --- SIGNALS DERIVADOS (COMPUTED) ---

  public totalPages = computed(() => {
    return Math.ceil(this.allProducts().length / this.itemsPerPage);
  });

  public displayedProducts = computed(() => {
    // ... (lógica idéntica)
    const page = this.currentPage();
    const all = this.allProducts();
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return all.slice(start, end);
  }); // 2. AÑADIMOS EL 'effect' PARA EFECTOS SECUNDARIOS

  constructor() {
    // Un 'effect' es un código que se ejecuta
    // cada vez que un Signal que lee, cambia.
    effect(() => {
      // 2a. Leemos 'currentPage' para crear la dependencia
      const page = this.currentPage();

      // 2b. Ejecutamos el efecto secundario
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log('Efecto reactivo: Cargando datos para la página:', page);
    });
  } // 3. EL MÉTODO onPageChange HA SIDO ELIMINADO.
  /*
  public onPageChange(newPage: number): void {
    // ¡Ya no se necesita! El binding [(currentPage)]
    // actualiza 'this.currentPage' automáticamente.
    // Y el 'effect' se encarga del 'scrollTo'.
  }
  */
}
