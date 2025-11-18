import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, take, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ICustomResponse } from '../../models/customResponse';
import { Product } from '../../models/product.model';

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
    const formData = this.getFormData(product);

    this.http
      .post<ICustomResponse<Product>>(environment.apiURL + '/product', formData)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('ProductsService: Error al obtener los productos', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this._data.update((data) => [...data, response.data!]);
        },
        error: () => {
          console.error('ThrowError: Error al obtener los productos');
        },
      });
  }

  updateProduct(product: Product) {
    const formData = this.getFormData(product);

    this.http
      .put<ICustomResponse<Product>>(environment.apiURL + '/product/' + product.id, formData)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('ProductsService: Error al obtener los productos', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this._data.update((data) => {
            const index = data.findIndex((p) => p.id === response.data!.id);
            if (index !== -1) {
              data[index] = response.data!;
            }
            return [...data];
          });
        },
        error: () => {
          console.error('ThrowError: Error al obtener los productos');
        },
      });
  }

  getFormData(product: Product) {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('description', product.description);
    formData.append('stock', product.stock.toString());
    formData.append('category', product.category.toString());
    formData.append('image', product.image);
    formData.append('status', product.status);
    return formData;
  }
}
