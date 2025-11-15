import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService<T> {
  isOpen = signal(false);
  data = signal<T | null>(null);

  open(data: T | null = null) {
    this.isOpen.set(true);
    this.data.set(data);
  }

  close() {
    this.isOpen.set(false);
  }
}
