import { Component } from '@angular/core';
import { OrdersList } from '../../../feature/user/Components/orders/orders';

@Component({
  selector: 'app-orders',
  imports: [OrdersList],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {}
