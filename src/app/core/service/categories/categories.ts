import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, take, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from '../../models/category.model';
import { ICustomResponse } from '../../models/customResponse';
import { Status } from '../../models/status.model';
import { NotificationService } from '../notification/notification';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private _data = signal<Category[]>([]);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  // <--- Exponemos el Signal como ReadOnly --->
  // Esto permite que el componente use () para detectar cambios
  public readonly categories = this._data.asReadonly();

  get data() {
    return this._data();
  }

  getCategories(status?: Status): void {
    this.http
      .get<ICustomResponse<Category[]>>(environment.apiURL + '/category/all', {
        params: {
          status: status || '',
        },
      })
      .pipe(
        take(1),
        catchError((error) => {
          console.error('CategoriesService: Error al obtener las categorías', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          // Aseguramos que guardamos el array de categorías
          // Si devuelve directo el array, usa response.
          const categoriesData = response.data || (response as any);
          this._data.set(categoriesData);
        },
        error: () => {
          console.error('ThrowError: Error al obtener las categorías');
        },
      });
  }

  addCategory(category: Category) {
    this.http
      .post<ICustomResponse<Category>>(environment.apiURL + '/category', category)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('CategoriesService: Error al obtener las categorías', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this.notificationService.success('Categoría creada.');
          this._data.update((data) => [...data, response.data!]);
        },
        error: () => {
          this.notificationService.error('Error al crear la categoría.');
          console.error('ThrowError: Error al obtener las categorías');
        },
      });
  }

  updateCategory(category: Category) {
    this.http
      .put<ICustomResponse<Category>>(environment.apiURL + '/category/' + category.id, category)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('CategoriesService: Error al obtener las categorías', error);
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
            this.notificationService.success('Categoría actualizada.');
            return [...data];
          });
        },
        error: () => {
          this.notificationService.error('Error al actualizar la categoría.');
          console.error('ThrowError: Error al obtener las categorías');
        },
      });
  }

  deleteCategory(id: string) {
    this.http
      .delete<ICustomResponse<Category>>(environment.apiURL + '/category/' + id)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('CategoriesService: Error al obtener las categorías', error);
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
            this.notificationService.success('Categoría eliminada.');
            return [...data];
          });
        },
        error: () => {
          this.notificationService.error('Error al eliminar la categoría.');
          console.error('ThrowError: Error al obtener las categorías');
        },
      });
  }
}
