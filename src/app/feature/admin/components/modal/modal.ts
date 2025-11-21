import { Component, computed, inject, input } from '@angular/core';
import { CategoryForm } from '../categories/category-form/category-form';
import { Form } from '../products/product-form/product-form';
import { ModalService } from './service/modal';

@Component({
  selector: 'app-modal',
  imports: [Form, CategoryForm],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  modalService = inject(ModalService);
  type = input.required<'product' | 'category'>();

  isOpen = computed(() => this.modalService.isOpen());
  data = computed(() => this.modalService.data());

  closeModal() {
    this.modalService.close();
  }
}
