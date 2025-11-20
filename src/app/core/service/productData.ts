import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // 👈 Cambiado de 'Product' a 'ProductService'
  private products: Product[] = [];

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los productos
   */
 
   getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiURL}/product/all`).pipe(
      tap((data) => (this.products = data))
    );
  }

  /**
   * Obtener producto por ID
   */
  getProductById(id: string): Observable<Product | null> {
    const product = this.products.find((p) => p.id === id) ?? null;
    return of(product);
  }

  /**
   * Obtener productos por categoría
   */
  getProductsByCategory(category: string): Observable<Product[]> {
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
  return this.http.get<Product[]>(`${environment.apiURL}/product/all`).pipe(
    
  );
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
