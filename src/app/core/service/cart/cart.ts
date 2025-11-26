// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Auth } from '../auth/auth';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _items = new BehaviorSubject<CartItem[]>([]);
  items$ = this._items.asObservable();
  constructor(private http: HttpClient,private auth: Auth) {}

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

  removeItem(id: string): void {
    const items = this._items.value.filter((item) => item.id !== id);
    this._items.next(items);
  }

  updateQuantity(id: string, quantity: number): void {
    const items = this._items.value.map((item) =>
      item.id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
    );

    this._items.next(items);
  }
saveCart(): void {
  const cart = this._items.value; // carrito actual
  const user = this.auth.getCurrentUser(); // usuario actual

  if (!user) {
    console.error('Usuario no autenticado');
    return;
  }

  // Construyes el objeto con uid y carrito
  const cartSave = {
    uid: user.uid, 
    cart: cart.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }))   
  };

  // Envías al backend
  this.http.post(`${environment.apiURL}/cart`, cartSave).subscribe({
    next: (res) => console.log('Carrito sincronizado con backend', res),
    error: (err) => console.error('Error al sincronizar carrito', err),
  });
}
  /* Limpia completamente el carrito */
  clearCart(): void {
    this._items.next([]);

    const user = this.auth.getCurrentUser();
    if (user) {
      this.http.delete(`${environment.apiURL}/cart/${user.uid}`).subscribe({
        next: () => console.log('🧹 Carrito vaciado en backend'),
        error: (err) => console.error('Error al limpiar carrito:', err),
      });
    }
  }
}
