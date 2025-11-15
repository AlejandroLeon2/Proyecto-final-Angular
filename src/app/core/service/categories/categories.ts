import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, take, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from '../../models/category.model';
import { ICustomResponse } from '../../models/customResponse';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private _data = signal<Category[]>([]);
  private http = inject(HttpClient);

  get data() {
    return this._data();
  }

  getCategories(): void {
    this.http
      .get<Category[]>(environment.apiURL + '/category/all')
      .pipe(
        take(1),
        catchError((error) => {
          console.error('CategoriesService: Error al obtener las categorías', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this._data.set(response);
        },
        error: () => {
          console.error('ThrowError: Error al obtener las categorías');
        },
      });
  }

  addCategory(category: Category) {
    const formData = this.getFormData(category);

    this.http
      .post<ICustomResponse<Category>>(environment.apiURL + '/category', formData)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('CategoriesService: Error al obtener las categorías', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this._data.update((data) => [...data, response.data!]);
        },
        error: () => {
          console.error('ThrowError: Error al obtener las categorías');
        },
      });
  }

  updateCategory(category: Category) {
    const formData = this.getFormData(category);

    this.http
      .put<ICustomResponse<Category>>(environment.apiURL + '/category/' + category.id, formData)
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
            return [...data];
          });
        },
        error: () => {
          console.error('ThrowError: Error al obtener las categorías');
        },
      });
  }

  getFormData(category: Category) {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('description', category.description);
    formData.append('status', category.status);
    return formData;
  }
}
