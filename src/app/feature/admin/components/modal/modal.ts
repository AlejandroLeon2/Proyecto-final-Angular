import { Component, computed, inject } from '@angular/core';
import { Form } from '../form/form';
import { ModalService } from './service/modal';

@Component({
  selector: 'app-modal',
  imports: [Form],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  modalService = inject(ModalService);

  isOpen = computed(() => this.modalService.isOpen());
  data = computed(() => this.modalService.data());

  closeModal() {
    this.modalService.close();
  }
}
