import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../../../core/models/order.model';
import { OrdersService } from '../../../../../core/service/orders/orders';

@Component({
  selector: 'app-orders-detail',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './orders-detail.html',
  styleUrl: './orders-detail.css',
})
export class OrdersDetail {
  private ordersService = inject(OrdersService);
  private route = inject(ActivatedRoute);

  order = signal<Order>({} as Order);
  isLoaded = signal(false);

  address = computed(() => {
    const { address } = this.order();
    if (address) return `${address.street} ${address.number}\n${address.city}`;
    return '';
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.ordersService.getOrderById(id).subscribe({
      next: (res) => {
        const { data } = res;
        if (data) {
          this.order.set(data);
          this.isLoaded.set(true);
        }
      },
    });
  }
}
