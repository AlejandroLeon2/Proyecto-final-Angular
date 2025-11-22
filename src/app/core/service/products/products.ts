import { HttpClient,HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, take, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ICustomResponse } from '../../models/customResponse';
import { Product } from '../../models/product.model';

// Interfaces para la respuesta paginada
export interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedProductResponse {
  products: Product[];
  pagination: PaginationData;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private _data = signal<Product[]>([]);
  private http = inject(HttpClient);

  get data() {
    return this._data();
  }

  // --- MÉTODO NUEVO: Obtener productos paginados ---
  getPaginatedProducts(page: number = 1, limit: number = 10, categories: string[] = []) {//parametro categories agregado opcional
    let params = new HttpParams() //cambio de const a let porque se va a modificar
      .set('page', page.toString())
      .set('limit', limit.toString());

    // <--- CAMBIO: Si hay categorías, las agregamos a los parámetros --->
    if (categories.length > 0) {
      // Unimos el array por comas: ['ID1', 'ID2'] -> "ID1,ID2"
      params = params.set('categories', categories.join(','));
    }

    return this.http
      .get<ICustomResponse<PaginatedProductResponse>>(
        `${environment.apiURL}/product/paginated`,
        { params }
      )
      .pipe(
        take(1),
        // Extraemos directamente la data relevante de la respuesta CustomResponse
        map((response) => {
           if (!response.success || !response.data) {
             throw new Error(response.message || 'Error al obtener productos');
           }
           return response.data; 
        }),
        catchError((error) => {
          console.error('ProductsService: Error al obtener productos paginados', error);
          return throwError(() => error);
        })
      );
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
  getProductById(id: string) {
  return this.http
      .get<Product>(`${environment.apiURL}/product/${id}`)
    //.get<ICustomResponse<Product>>(environment.apiURL + '/product/' + id)
    .pipe(
      take(1),
      /*map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error al obtener producto');
        }
        return response.data;
      }),*/
      catchError((error) => {
        console.error('ProductsService: Error al obtener producto por id', error);
        return throwError(() => error);
      })
    );
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
