import { Component, signal, input } from '@angular/core';
import { ChevronDown,LucideAngularModule } from 'lucide-angular';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'pedidos' | 'pagos' | 'envios';
  icon: any;
}

@Component({
  selector: 'app-acordion',
  imports: [LucideAngularModule],
  templateUrl: './acordion.html',
  styleUrl: './acordion.css',
})
export class Acordion {
    readonly ChevronDownIcon = ChevronDown;
    index = input<number|undefined>();
  faq = input<FAQ>();
  openItems = signal<Set<number>>(new Set());
  toggle(id: number) {
    this.openItems.update((items) => {
      const newSet = new Set(items);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  isOpen(id: number): boolean {
    return this.openItems().has(id);
  }
}
