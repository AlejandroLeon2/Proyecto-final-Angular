import { Injectable, signal } from '@angular/core';
import { Product } from '../../../../../core/models/product';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  isOpen = signal(false);
  data = signal<Product | null>(null);

  open(data: Product | null = null) {
    this.isOpen.set(true);
    this.data.set(data);
  }

  close() {
    this.isOpen.set(false);
  }
}
