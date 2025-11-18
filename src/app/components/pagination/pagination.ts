// 1. Importamos 'model' desde @angular/core
import { Component, computed, Input, Signal, model } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.html',
})
export class Pagination {
  // --- ENTRADAS (Inputs) ---

  //model() es una API especial que crea un signal que puede ser leído y escrito(two-way binding)
  //devuelve un WritableSignal.
  // WritableSignal: signal escribible

  //currentPage ahora es un ModelSignal, esto significa que puede ser leído y escrito.
  public currentPage = model.required<number>(); //currentPage: Pagina actual

  @Input({ required: true }) totalPages!: Signal<number>; //totalPages: Total de paginas

  public pages = computed(() => {
    const current = this.currentPage(); // Lee el ModelSignal
    const total = this.totalPages(); // Regla 1:
    // ... (Tu lógica de 4 reglas sigue idéntica)
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    } // Regla 2:
    if (current < 5) {
      return [1, 2, 3, 4, 5, '...', total];
    } // Regla 3:
    if (current > total - 4) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    } // Regla 4:
    return [1, '...', current - 1, current, current + 1, '...', total];
  }); 
  
  // --- MÉTODOS ---

  public changePage(page: number | string): void { //changePage: cambiarPagina
    if (typeof page === 'number') {
      if (page < 1 || page > this.totalPages()) return;
      // Esto actualiza el valor local Y emite el cambio al padre.
      this.currentPage.set(page);
    }
  } 

  public goToPrevious(): void {
    this.changePage(this.currentPage() - 1);
  }

  public goToNext(): void {
    this.changePage(this.currentPage() + 1);
  }
}
