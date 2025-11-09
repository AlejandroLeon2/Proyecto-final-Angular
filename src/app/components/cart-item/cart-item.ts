import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  templateUrl: './cart-item.html',
  styleUrls: ['./cart-item.css']
})
export class CartItemComponent {
  @Input() item: any;
  @Output() quantityChange = new EventEmitter<{id: number, quantity: number}>();
  @Output() removeItem = new EventEmitter<number>();

  updateQuantity(id: number, quantity: number) {
    this.quantityChange.emit({ id, quantity });
  }

  onRemoveItem(id: number) {
    this.removeItem.emit(id);
  }
}