import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CATEGORIES } from '../../core/constants/categories';

export interface FilterState {
  categories: string[];
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})
export class FilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<FilterState>();

  // Estado de las categorías seleccionadas
  selectedCategories = signal<string[]>([]);
  
  // Estado de expansión de secciones
  categoryExpanded = signal<boolean>(true);

  // Categorías disponibles
  categories = Object.values(CATEGORIES);

  ngOnInit(): void {
    // Inicializar con valores por defecto
    this.emitFilterChange();
  }

  /**
   * Maneja el cambio de selección de categoría
   */
  onCategoryChange(category: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const current = this.selectedCategories();

    if (isChecked) {
      this.selectedCategories.set([...current, category]);
    } else {
      this.selectedCategories.set(current.filter((c) => c !== category));
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
  isCategorySelected(category: string): boolean {
    return this.selectedCategories().includes(category);
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

