import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartItemComponent } from './cart-item';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;
  const mockItem = {
    id: 1,
    nombre: 'Test Product',
    precio: 99.99,
    categoria: 'Test Category',
    imagen: 'test-image.jpg',
    cantidad: 2
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    component.item = mockItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display item details correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('.item-name')?.textContent).toContain('Test Product');
    expect(compiled.querySelector('.item-category')?.textContent).toContain('Test Category');
    expect(compiled.querySelector('.item-price')?.textContent).toContain('$99.99');
    expect(compiled.querySelector('.quantity')?.textContent).toContain('2');
    
    const img = compiled.querySelector('.item-image') as HTMLImageElement;
    expect(img.src).toContain('test-image.jpg');
    expect(img.alt).toBe('Test Product');
  });

  it('should emit quantity change when updating quantity', () => {
    spyOn(component.quantityChange, 'emit');
    
    component.updateQuantity(1, 3);
    
    expect(component.quantityChange.emit).toHaveBeenCalledWith({ id: 1, quantity: 3 });
  });

  it('should emit remove item when clicking remove button', () => {
    spyOn(component.removeItem, 'emit');
    
    component.onRemoveItem(1);
    
    expect(component.removeItem.emit).toHaveBeenCalledWith(1);
  });

  it('should have working quantity controls', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const decreaseBtn = compiled.querySelector('.quantity-btn:first-child') as HTMLButtonElement;
    const increaseBtn = compiled.querySelector('.quantity-btn:last-child') as HTMLButtonElement;
    spyOn(component.quantityChange, 'emit');

    decreaseBtn.click();
    expect(component.quantityChange.emit).toHaveBeenCalledWith({ id: 1, quantity: 1 });

    increaseBtn.click();
    expect(component.quantityChange.emit).toHaveBeenCalledWith({ id: 1, quantity: 3 });
  });
});