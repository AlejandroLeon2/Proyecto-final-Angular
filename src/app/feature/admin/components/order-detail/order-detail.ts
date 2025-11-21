import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderAddress } from '../../../../core/models/order.model';
import { OrdersService } from '../../../../core/service/orders/orders';
import { OrderHeaderDetail } from './order-header-detail/order-header-detail';
import { OrderItemsDetail } from './order-items-detail/order-items-detail';

@Component({
  selector: 'app-order-detail',
  imports: [OrderHeaderDetail, OrderItemsDetail],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail implements OnInit {
  private ordersService = inject(OrdersService);
  private route = inject(ActivatedRoute);

  order = signal<Order>({} as Order);
  isLoaded = signal(false);

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
  formatAddress(addr: OrderAddress) {
    return `${addr.street} ${addr.number}\n${addr.city}`;
  }
}
