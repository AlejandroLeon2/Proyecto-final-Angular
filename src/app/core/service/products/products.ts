import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, take, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private _data = signal<Product[]>([]);
  private http = inject(HttpClient);

  get data() {
    return this._data();
  }

  getProducts(): void {
    this.http
      .get<Product[]>(environment.apiURL + '/product/all')
      .pipe(
        take(1),
        catchError((error) => {
          console.error('ProductsService: Error al obtener los productos', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this._data.set(response);
        },
        error: () => {
          console.error('ThrowError: Error al obtener los productos');
        },
      });
  }

  addProduct(product: Product) {
    this.http
      .post<Product>(environment.apiURL + '/product', product)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('ProductsService: Error al obtener los productos', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          console.log('ProductsService: ', response);
          this._data.update((data) => [...data, response]);
        },
        error: () => {
          console.error('ThrowError: Error al obtener los productos');
        },
      });
  }

  updateProduct(product: Product) {
    this.http
      .put<Product>(environment.apiURL + '/product', product)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('ProductsService: Error al obtener los productos', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (product) => {
          this._data.update((data) => {
            const index = data.findIndex((p) => p.id === product.id);
            if (index !== -1) {
              data[index] = product;
            }
            return [...data];
          });
        },
        error: () => {
          console.error('ThrowError: Error al obtener los productos');
        },
      });
  }
}
