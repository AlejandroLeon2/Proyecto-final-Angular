import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product';
import productsData from '../../../data/products.json';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // 👈 Cambiado de 'Product' a 'ProductService'
  private products: Product[] = productsData as Product[];

  constructor() {}

  /**
   * Obtener todos los productos
   */
  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  /**
   * Obtener producto por ID
   */
  getProductById(id: number): Observable<Product | null> {
    const product = this.products.find((p) => p.id === id) ?? null;
    return of(product);
  }

  /**
   * Obtener productos por categoría
   */
  getProductsByCategory(category: number): Observable<Product[]> {
    const filtered = this.products.filter((p) => p.category === category);
    return of(filtered);
  }

  /**
   * Obtener productos activos
   */
  getActiveProducts(): Observable<Product[]> {
    const active = this.products.filter((p) => p.status === 'active');
    return of(active);
  }

  /**
   * Obtener productos destacados (primeros 8)
   */
  getFeaturedProducts(): Observable<Product[]> {
    const featured = this.products.slice(0, 8);
    return of(featured);
  }

  /**
   * Buscar productos por nombre o descripción
   */
  searchProducts(query: string): Observable<Product[]> {
    const lowerQuery = query.toLowerCase();
    const results = this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
    return of(results);
  }

  /**
   * Obtener productos con stock bajo (< 10)
   */
  getLowStockProducts(): Observable<Product[]> {
    const lowStock = this.products.filter((p) => p.stock > 0 && p.stock < 10);
    return of(lowStock);
  }

  /**
   * Obtener productos sin stock
   */
  getOutOfStockProducts(): Observable<Product[]> {
    const outOfStock = this.products.filter((p) => p.stock === 0);
    return of(outOfStock);
  }
}
