import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { take } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ICustomResponse } from '../../models/customResponse';
import { Order } from '../../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  _data = signal<Order[]>([]);
  http = inject(HttpClient);

  get data() {
    return this._data();
  }

  getOrders() {
    this.http
      .get<ICustomResponse<Order[]>>(environment.apiURL + '/order/all')
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.data) {
            this._data.set(res.data);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getOrderById(id: string) {
    return this.http.get<ICustomResponse<Order>>(`${environment.apiURL}/order/${id}`).pipe(take(1));
  }

  getOrdersByUser(uid: string) {
    return this.http.get<ICustomResponse<Order[]>>(`${environment.apiURL}/order/user/${uid}`);
  }
}
