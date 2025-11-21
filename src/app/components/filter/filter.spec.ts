import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent, FilterState } from './filter';
import { CATEGORIES } from '../../core/constants/categories';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedCategories().length).toBe(0);
    expect(component.minPrice()).toBe(0);
    expect(component.maxPrice()).toBe(1000);
    expect(component.currentPrice()).toBe(1000);
  });

  it('should load all categories from constants', () => {
    const categories = Object.values(CATEGORIES);
    expect(component.categories.length).toBe(categories.length);
    expect(component.categories).toEqual(categories);
  });

  it('should toggle category selection', () => {
    const category = component.categories[0];
    const checkbox = fixture.nativeElement.querySelector(
      `input[type="checkbox"]`
    ) as HTMLInputElement;

    // Simular selección de categoría
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(component.isCategorySelected(category)).toBe(true);
    expect(component.selectedCategories().includes(category)).toBe(true);
  });

  it('should deselect category when unchecked', () => {
    const category = component.categories[0];

    // Seleccionar primero
    component.selectedCategories.set([category]);
    fixture.detectChanges();

    // Deseleccionar
    const checkbox = fixture.nativeElement.querySelector(
      `input[type="checkbox"]`
    ) as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));

    expect(component.isCategorySelected(category)).toBe(false);
    expect(component.selectedCategories().includes(category)).toBe(false);
  });

  it('should update price when slider changes', () => {
    const slider = fixture.nativeElement.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement;
    const newPrice = 500;

    slider.value = newPrice.toString();
    slider.dispatchEvent(new Event('input'));

    expect(component.currentPrice()).toBe(newPrice);
    expect(component.maxPrice()).toBe(newPrice);
  });

  it('should clear all filters', () => {
    // Establecer algunos filtros
    component.selectedCategories.set([component.categories[0]]);
    component.currentPrice.set(500);
    fixture.detectChanges();

    // Limpiar filtros
    component.clearFilters();

    expect(component.selectedCategories().length).toBe(0);
    expect(component.currentPrice()).toBe(1000);
    expect(component.maxPrice()).toBe(1000);
    expect(component.minPrice()).toBe(0);
  });

  it('should detect active filters correctly', () => {
    // Sin filtros activos
    expect(component.hasActiveFilters()).toBe(false);

    // Con categoría seleccionada
    component.selectedCategories.set([component.categories[0]]);
    expect(component.hasActiveFilters()).toBe(true);

    // Limpiar y probar con precio
    component.selectedCategories.set([]);
    component.currentPrice.set(500);
    expect(component.hasActiveFilters()).toBe(true);
  });

  it('should emit filterChange event when category changes', (done) => {
    component.filterChange.subscribe((filters: FilterState) => {
      expect(filters).toBeDefined();
      expect(filters.categories).toBeDefined();
      expect(filters.minPrice).toBeDefined();
      expect(filters.maxPrice).toBeDefined();
      done();
    });

    const category = component.categories[0];
    const mockEvent = {
      target: { checked: true },
    } as unknown as Event;

    component.onCategoryChange(category, mockEvent);
  });

  it('should emit filterChange event when price changes', (done) => {
    component.filterChange.subscribe((filters: FilterState) => {
      expect(filters.maxPrice).toBe(500);
      done();
    });

    const mockEvent = {
      target: { value: '500' },
    } as unknown as Event;

    component.onPriceChange(mockEvent);
  });

  it('should emit filterChange event when filters are cleared', (done) => {
    component.filterChange.subscribe((filters: FilterState) => {
      expect(filters.categories.length).toBe(0);
      expect(filters.maxPrice).toBe(1000);
      done();
    });

    component.clearFilters();
  });

  it('should toggle category section expansion', () => {
    expect(component.categoryExpanded()).toBe(true);

    component.toggleCategorySection();
    expect(component.categoryExpanded()).toBe(false);

    component.toggleCategorySection();
    expect(component.categoryExpanded()).toBe(true);
  });

  it('should toggle price section expansion', () => {
    expect(component.priceExpanded()).toBe(true);

    component.togglePriceSection();
    expect(component.priceExpanded()).toBe(false);

    component.togglePriceSection();
    expect(component.priceExpanded()).toBe(true);
  });

  it('should toggle brand section expansion', () => {
    expect(component.brandExpanded()).toBe(false);

    component.toggleBrandSection();
    expect(component.brandExpanded()).toBe(true);

    component.toggleBrandSection();
    expect(component.brandExpanded()).toBe(false);
  });

  it('should disable clear button when no filters are active', () => {
    component.selectedCategories.set([]);
    component.currentPrice.set(1000);
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector(
      '.clear-filters-button'
    ) as HTMLButtonElement;
    expect(clearButton.disabled).toBe(true);
  });

  it('should enable clear button when filters are active', () => {
    component.selectedCategories.set([component.categories[0]]);
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector(
      '.clear-filters-button'
    ) as HTMLButtonElement;
    expect(clearButton.disabled).toBe(false);
  });
});

