import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-venta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-venta.html',
  styleUrl: './modal-venta.css',
})
export class ModalVenta implements OnChanges {
  @Input() isVisible: boolean = false;
  @Input() orderNumber?: string;
  @Input() total: number = 0;
  @Output() closeModal = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible']) {
      console.log('🎭 Modal visibility changed:', changes['isVisible'].currentValue);
    }
  }

  close() {
    console.log('🔴 Modal close button clicked');
    this.closeModal.emit();
  }
}
