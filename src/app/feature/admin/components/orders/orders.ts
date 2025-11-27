import { Component, computed, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../../../core/service/orders/orders';
import { ModalService } from '../modal/service/modal';
import { SearchBar } from '../search-bar/search-bar';
import { OrdersTable } from './orders-table/orders-table';

@Component({
  selector: 'app-orders',
  imports: [SearchBar, OrdersTable],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  quickFilterText: string = '';

  ordersService = inject(OrdersService);
  modalService = inject(ModalService);

  rowData = computed(() => this.ordersService.data);

  ngOnInit(): void {
    this.ordersService.getOrders();
  }
}
