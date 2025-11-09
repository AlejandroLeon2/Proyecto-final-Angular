import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { LucideAngularModule, PenLine, Trash } from 'lucide-angular';

@Component({
  selector: 'app-actions-cell-renderer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <span :class="missionSpan">
      @if (value()) {
      <div class="flex gap-2">
        <button
          class="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded flex items-center"
        >
          <lucide-icon [img]="penLine" size="18" class="icon"></lucide-icon>
        </button>
        <button
          class="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded flex items-center"
        >
          <lucide-icon [img]="trash" size="18" class="icon"></lucide-icon>
        </button>
      </div>
      }
    </span>
  `,
  styles: [
    'img { width: auto; height: auto; } span {display: flex; height: 100%; justify-content: center; align-items: center} ',
  ],
})
export class ActionsCellRenderer implements ICellRendererAngularComp {
  penLine = PenLine;
  trash = Trash;

  value = signal<string | undefined>(undefined);

  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.value.set(params.value ? 'penLine' : 'trash');
    return true;
  }
}
