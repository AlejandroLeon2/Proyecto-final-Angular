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
      .get<Product[]>(environment.apiURL + '/products')
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
          console.log('ProductsService: ', this._data());
        },
        error: () => {
          console.error('ThrowError: Error al obtener los productos');
        },
      });
  }

  addProduct(product: Product) {
    //TODO: Implement API call
    this.http
      .post<Product>(environment.apiURL + '/products', product)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('ProductsService: Error al obtener los productos', error);
          return throwError(() => error);
          // return of(product);
        })
      )
      .subscribe({
        next: (response) => {
          // response.id = this.data.length + 1;
          // response.image =
          //   'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png';
          this._data.update((data) => [...data, response]);
          console.log('ProductsService: ', this._data());
        },
        error: () => {
          console.error('ThrowError: Error al obtener los productos');
        },
      });
  }

  updateProduct(product: Product) {
    //TODO: Implement API call
    this.http
      .put<Product>(environment.apiURL + '/products', product)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('ProductsService: Error al obtener los productos', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (product) => {
          const index = this.data.findIndex((p) => p.id === product.id);
          if (index !== -1) {
            this.data[index] = product;
          }
          this._data.update((data) => [...data]);
          console.log('ProductsService: ', this._data());
        },
        error: () => {
          console.error('ThrowError: Error al obtener los productos');
        },
      });
  }
}
