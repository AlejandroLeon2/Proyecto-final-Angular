import { Component, input, output } from '@angular/core';
import { Form } from '../form/form';

@Component({
  selector: 'app-modal',
  imports: [Form],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  isOpen = input(false);
  openEvent = output<boolean>();

  closeModal() {
    this.openEvent.emit(false);
  }
}
