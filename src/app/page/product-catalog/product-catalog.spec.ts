import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCatalog } from './product-catalog';
import { ProductService } from '../../core/service/productData';
import { of } from 'rxjs';
import { Product } from '../../core/models/product.model';

describe('ProductCatalog', () => {
  let component: ProductCatalog;
  let fixture: ComponentFixture<ProductCatalog>;
  let productService: jasmine.SpyObj<ProductService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Producto 1',
      description: 'Descripción 1',
      price: 100,
      stock: 10,
      category: 'Electrónica',
      status: 'active',
      image: 'image1.jpg',
    },
    {
      id: 2,
      name: 'Producto 2',
      description: 'Descripción 2',
      price: 200,
      stock: 20,
      category: 'Deportes',
      status: 'active',
      image: 'image2.jpg',
    },
    {
      id: 3,
      name: 'Producto 3',
      description: 'Descripción 3',
      price: 50,
      stock: 5,
      category: 'Electrónica',
      status: 'active',
      image: 'image3.jpg',
    },
    {
      id: 4,
      name: 'Producto 4',
      description: 'Descripción 4',
      price: 1500,
      stock: 15,
      category: 'Tecnología',
      status: 'active',
      image: 'image4.jpg',
    },
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
    ]);

    await TestBed.configureTestingModule({
      imports: [ProductCatalog],
      providers: [{ provide: ProductService, useValue: productServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCatalog);
    component = fixture.componentInstance;
    productService = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    productService.getProducts.and.returnValue(of(mockProducts));

    component.ngOnInit();

    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products().length).toBe(4);
    expect(component.filteredProducts().length).toBe(4);
  });

  it('should filter products by category', () => {
    productService.getProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();

    const filters = {
      categories: ['Electrónica'],
      minPrice: 0,
      maxPrice: 1000,
    };

    component.onFilterChange(filters);

    expect(component.filteredProducts().length).toBe(2);
    expect(
      component.filteredProducts().every((p) => p.category === 'Electrónica')
    ).toBe(true);
  });

  it('should filter products by price range', () => {
    productService.getProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();

    const filters = {
      categories: [],
      minPrice: 0,
      maxPrice: 150,
    };

    component.onFilterChange(filters);

    expect(component.filteredProducts().length).toBe(2);
    expect(
      component
        .filteredProducts()
        .every((p) => p.price >= 0 && p.price <= 150)
    ).toBe(true);
  });

  it('should filter products by both category and price', () => {
    productService.getProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();

    const filters = {
      categories: ['Electrónica'],
      minPrice: 0,
      maxPrice: 150,
    };

    component.onFilterChange(filters);

    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].category).toBe('Electrónica');
    expect(component.filteredProducts()[0].price).toBeLessThanOrEqual(150);
  });

  it('should show all products when no filters are applied', () => {
    productService.getProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();

    const filters = {
      categories: [],
      minPrice: 0,
      maxPrice: 1000,
    };

    component.onFilterChange(filters);

    expect(component.filteredProducts().length).toBe(4);
  });

  it('should show empty list when filters match no products', () => {
    productService.getProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();

    const filters = {
      categories: ['Moda'],
      minPrice: 0,
      maxPrice: 1000,
    };

    component.onFilterChange(filters);

    expect(component.filteredProducts().length).toBe(0);
  });

  it('should handle multiple categories', () => {
    productService.getProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();

    const filters = {
      categories: ['Electrónica', 'Deportes'],
      minPrice: 0,
      maxPrice: 1000,
    };

    component.onFilterChange(filters);

    expect(component.filteredProducts().length).toBe(3);
    expect(
      component
        .filteredProducts()
        .every((p) =>
          ['Electrónica', 'Deportes'].includes(p.category)
        )
    ).toBe(true);
  });

  it('should handle service error gracefully', () => {
    const consoleSpy = spyOn(console, 'error');
    productService.getProducts.and.returnValue(
      of([]).pipe(() => {
        throw new Error('Service error');
      })
    );

    component.ngOnInit();

    // El componente no debería romperse
    expect(component).toBeTruthy();
  });
});

