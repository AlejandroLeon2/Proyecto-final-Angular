import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '../../core/models/cart-item.model';
import { CurrencyPipe } from '@angular/common';
import { LucideAngularModule,Trash2, Minus,Plus } from "lucide-angular";

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CurrencyPipe, LucideAngularModule],
  templateUrl: './cart-item.html',
  styleUrls: ['./cart-item.css'],
})
export class CartItemComponent {
  readonly Minus=Minus;
  readonly Plus=Plus;
  Trash2 =Trash2 ;
  @Input() item!: CartItem;

  @Output() quantityChange = new EventEmitter<{ id: string; quantity: number }>();
  @Output() removeItem = new EventEmitter<string>();

  updateQuantity(id: string, quantity: number) {
    this.quantityChange.emit({ id, quantity });
  }

  onRemoveItem(id: string) {
    this.removeItem.emit(id);
  }
}
