import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, take, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ICustomResponse } from '../../models/customResponse';
import { Product } from '../../models/product.model';
import { Status } from '../../models/status.model';
import { NotificationService } from '../notification/notification';

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
  private notification = inject(NotificationService);

  get data() {
    return this._data();
  }

  // --- MÉTODO NUEVO: Obtener productos paginados ---
  getPaginatedProducts(page: number = 1, limit: number = 10, categories: string[] = []) {
    //parametro categories agregado opcional
    let params = new HttpParams() //cambio de const a let porque se va a modificar
      .set('page', page.toString())
      .set('limit', limit.toString());

    // <--- CAMBIO: Si hay categorías, las agregamos a los parámetros --->
    if (categories.length > 0) {
      // Unimos el array por comas: ['ID1', 'ID2'] -> "ID1,ID2"
      params = params.set('categories', categories.join(','));
    }

    return this.http
      .get<ICustomResponse<PaginatedProductResponse>>(`${environment.apiURL}/product/paginated`, {
        params,
      })
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

  // meodo para obtener todos los productos buscador desde search

  getPSearchProducts(page: number = 1, limit: number, query: string, categories: string[] = []) {

    //agregamos parametro
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set(`data`, query.toString())
      .set(`categories`, categories.join(','))
      ;

    return this.http
      .get<ICustomResponse<PaginatedProductResponse>>(`${environment.apiURL}/search/paginated`,{ params }
        ).pipe(
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
  getProducts(status?: Status[]): void {
    this.http
      .get<Product[]>(environment.apiURL + '/product/all', {
        params: { status: status?.join(',') || '' },
      })
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
          this.notification.success('Producto creado correctamente');
          this._data.update((data) => [...data, response.data!]);
        },
        error: () => {
          this.notification.error('Error al crear el producto');
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

            this.notification.success('Producto actualizado correctamente');
            return [...data];
          });
        },
        error: () => {
          this.notification.error('Por favor, completa correctamente todos los campos requeridos.');

          console.error('ThrowError: Error al obtener los productos');
        },
      });
  }
  getProductById(id: string) {
    return (
      this.http
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
        )
    );
  }

  deleteProduct(id: string) {
    this.http
      .delete<ICustomResponse<Product>>(environment.apiURL + '/product/' + id)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('ProductService: Error al obtener los productos', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: () => {
          this._data.update((data) => {
            const index = data.findIndex((p) => p.id === id);
            if (index !== -1) {
              data.splice(index, 1);
            }
            this.notification.success('Producto eliminado correctamente');
            return [...data];
          });
        },
        error: () => {
          this.notification.error('Error al eliminar el producto');
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
