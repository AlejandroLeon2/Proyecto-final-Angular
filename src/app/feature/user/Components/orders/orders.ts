import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { Order } from '../../../../core/models/order.model';
import { Auth } from '../../../../core/service/auth/auth';
import { OrdersService } from '../../../../core/service/orders/orders';
import { LucideAngularModule,ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe,LucideAngularModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersList {
  orders = signal<Order[]>([]);

  private authService = inject(Auth);
  private ordersService = inject(OrdersService);
  readonly ChevronRight=ChevronRight;

  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const uid = this.authService.getCurrentUser()?.uid;
    console.log(this.authService.getCurrentUser());

    if (!uid) {
      return;
    }

    this.ordersService
      .getOrdersByUser(uid)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.orders.set(res.data || []);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        },
      });
  }
}
