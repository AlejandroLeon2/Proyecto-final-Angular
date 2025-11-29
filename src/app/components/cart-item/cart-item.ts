import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CartItem } from '../../core/models/cart-item.model';
import { CurrencyPipe } from '@angular/common';
import { LucideAngularModule, Trash2, Minus, Plus } from 'lucide-angular';
import { CartService } from '../../core/service/cart/cart';
import { Auth } from '../../core/service/auth/auth';


@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CurrencyPipe, LucideAngularModule],
  templateUrl: './cart-item.html',
  styleUrls: ['./cart-item.css'],
})
export class CartItemComponent {
  readonly Minus = Minus;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  private cartService = inject(CartService);
  private authService = inject(Auth);
  @Input() item!: CartItem;

  @Output() quantityChange = new EventEmitter<{ id: string; quantity: number }>();
  @Output() removeItem = new EventEmitter<string>();

  updateQuantity(id: string, quantity: number) {
    this.quantityChange.emit({ id, quantity });
  }
  get user() {
    return this.authService.user();
  }

  onRemoveItem(id: string) {
    this.removeItem.emit(id);
  }
  isStockExceeded(): boolean {
    const currentQuantity = this.cartService.getQuantity(this.item!.id!);
    return currentQuantity >= this.item!.stock;
  }
  
}
