import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { LucideAngularModule, PenLine, Trash } from 'lucide-angular';
import { Product } from '../../../../../core/models/product.model';
import { ModalService } from '../../modal/service/modal';

@Component({
  selector: 'app-actions-cell-renderer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <span :class="missionSpan">
      <div class="flex gap-2">
        <button
          (click)="editProduct()"
          class="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded flex items-center"
        >
          <lucide-icon [img]="penLine" size="18" class="icon"></lucide-icon>
        </button>
        <button
          (click)="deleteProduct()"
          class="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded flex items-center"
        >
          <lucide-icon [img]="trash" size="18" class="icon"></lucide-icon>
        </button>
      </div>
    </span>
  `,
  styles: [
    'img { width: auto; height: auto; } span {display: flex; height: 100%; justify-content: center; align-items: center} ',
  ],
})
export class ActionsCellRenderer implements ICellRendererAngularComp {
  data = signal<Product | undefined>(undefined);

  modalService = inject(ModalService);

  // Icons
  penLine = PenLine;
  trash = Trash;

  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.data.set(params.data);
    return true;
  }

  editProduct() {
    this.modalService.open(this.data()!);
  }

  deleteProduct() {
    console.log('deleteProduct');
  }
}
