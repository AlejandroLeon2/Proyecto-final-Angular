// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _items = new BehaviorSubject<CartItem[]>([]);
  items$ = this._items.asObservable();

  getItems(): CartItem[] {
    return this._items.value;
  }

  addItem(product: Product, quantity: number = 1): void {
    const items = this._items.value;
    const idx = items.findIndex((i) => i.id === product.id);

    if (idx > -1) {
      items[idx].quantity += quantity;
    } else {
      items.push({
        ...product,
        quantity,
      });
    }

    this._items.next([...items]);
  }

  removeItem(id: number): void {
    const items = this._items.value.filter((item) => item.id !== id);
    this._items.next(items);
  }

  updateQuantity(id: number, quantity: number): void {
    const items = this._items.value.map((item) =>
      item.id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
    );

    this._items.next(items);
  }
}
