// src/app/services/cart.service.ts
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { effect } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Auth } from '../auth/auth';
import type { CartResponse, CartItemResponse } from '../../models/customResponse';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _items = new BehaviorSubject<CartItem[]>([]);
  items$ = this._items.asObservable();
  private auth: Auth = inject(Auth);
  private http: HttpClient = inject(HttpClient);

  constructor() {
    effect(() => {
      const user = this.auth.user(); 
      if (user) {
        this.loadCart(user.uid);
      } else {
        this._items.next([]); 
      }
    });
  }

  getItems(): CartItem[] {
    return this._items.value;
  }
  loadCart(uid: string): void {
    this.http
      .get<CartResponse>(`${environment.apiURL}/cart/${uid}`)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          const items: CartItem[] = res.data.map((item) => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            stock: item.stock,
            image: item.image,
            category: item.category,
          }));
          this._items.next(items);
          console.log('🛒 Carrito cargado desde backend', items);
        },
        error: (err) => console.error('Error al obtener carrito:', err),
      });
  }

  addItem(product: Product, quantity: number = 1): void {
    const items = this._items.value;
    const idx = items.findIndex((i) => i.id === product.id);

    if (idx > -1) {
      const currentQuantity = items[idx].quantity;
      const newQuantity = currentQuantity + quantity;

      if (newQuantity > product.stock) {
        console.warn(`No puedes agregar más de ${product.stock} unidades de ${product.name}`);
        return;
      }

      items[idx].quantity = newQuantity;
    } else {
      if (quantity > product.stock) {
        console.warn(`Stock insuficiente para ${product.name}`);
        return;
      }

      items.push({
        ...product,
        quantity,
      });
    }

    this._items.next([...items]);
  }

  getQuantity(productId: string): number {
    const item = this._items.value.find((i) => i.id === productId);
    return item ? item.quantity : 0;
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
      cart: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
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
