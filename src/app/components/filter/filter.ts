import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, output, Output, signal } from '@angular/core'; //se agrego inject
import { FormsModule } from '@angular/forms';
import { STATUS } from '../../core/models/status.model';
import { CategoriesService } from '../../core/service/categories/categories'; //Importamos el servicio real
import { LucideAngularModule, X } from 'lucide-angular';
export interface FilterState {
  categories: string[];
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule, CommonModule, LucideAngularModule],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})
export class FilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<FilterState>();
  @Output() refreshCatalogo = new EventEmitter<void>();

  // <--- Inyección del servicio de categorías --->
  private categoriesService = inject(CategoriesService);

  // <--- Usamos el Signal del servicio --->
  // Al no invocarlo con (), guardamos la REFERENCIA al signal
  categoriesSignal = this.categoriesService.categories;

  // Estado de las categorías seleccionadas
  selectedCategories = signal<string[]>([]);

  // Estado de expansión de secciones
  categoryExpanded = signal<boolean>(true);

  // <--- Signal para acceder a las categorías del servicio --->
  categories = this.categoriesService.data;

  // icono para cerrar y variable para searchWord
  clear = X;
  searchWord = ``;

  ngOnInit(): void {
    this.loadSearchWord(`get`);
    // <--- Cargar categorías reales al iniciar --->
    this.categoriesService.getCategories(STATUS.active);
  }

  loadSearchWord(metod:string):void{

    if(metod === `get`){
      this.searchWord = localStorage.getItem(`searchWord`)|| ``;
    };
    if(metod === `delete`){
      localStorage.removeItem(`searchWord`);
      this.searchWord = ``;
      this.clearFilters()
      this.refreshCatalogo.emit();
    }
  }
  /**
   * Maneja el cambio de selección de categoría
   */
  onCategoryChange(categoryId: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const current = this.selectedCategories();

    if (isChecked) {
      this.selectedCategories.set([...current, categoryId]);
    } else {
      this.selectedCategories.set(current.filter((c) => c !== categoryId));
    }

    this.emitFilterChange();
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    this.selectedCategories.set([]);
    this.emitFilterChange();
  }

  /**
   * Verifica si una categoría está seleccionada
   */
  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategories().includes(categoryId);
  }

  /**
   * Verifica si hay filtros activos
   */
  hasActiveFilters(): boolean {
    return this.selectedCategories().length > 0;
  }

  /**
   * Emite el evento de cambio de filtros
   */
  private emitFilterChange(): void {
    this.filterChange.emit({
      categories: this.selectedCategories(),
    });
  }

  /**
   * Alterna la expansión de la sección de categorías
   */
  toggleCategorySection(): void {
    this.categoryExpanded.set(!this.categoryExpanded());
  }
}
