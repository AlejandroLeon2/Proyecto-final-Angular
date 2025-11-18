import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { LucideAngularModule, PenLine, Trash } from 'lucide-angular';
import { Category } from '../../../../../core/models/category.model';
import { CategoriesService } from '../../../../../core/service/categories/categories';
import { ModalService } from '../../modal/service/modal';

@Component({
  selector: 'app-actions-cell-renderer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <span :class="missionSpan">
      <div class="flex gap-2">
        <button
          (click)="editItem()"
          class="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded flex items-center"
        >
          <lucide-icon [img]="penLine" size="18" class="icon"></lucide-icon>
        </button>
        <button
          (click)="deleteItem()"
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
  data = signal<Category | undefined>(undefined);

  modalService = inject(ModalService<Category>);
  categoryService = inject(CategoriesService);

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

  editItem() {
    this.modalService.open(this.data()!);
  }

  deleteItem() {
    this.categoryService.deleteCategory(this.data()!.id);
  }
}
