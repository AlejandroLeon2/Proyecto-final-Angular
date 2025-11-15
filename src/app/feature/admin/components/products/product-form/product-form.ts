import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, XIcon } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { Product } from '../../../../../core/models/product.model';
import { ProductsService } from '../../../../../core/service/products/products';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class Form implements OnDestroy {
  // Input signals with default values
  product = input<Product | null>(null);

  // Output signals
  close = output<void>();
  submitForm = output<Product>();

  productService = inject(ProductsService);

  subscriptions: Subscription = new Subscription();

  removeIcon = XIcon;

  // File upload reference
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  // Single form state signal
  formState = signal<Product>({
    name: '',
    price: 0,
    description: '',
    stock: 0,
    category: '',
    image: '',
    status: 'active',
  });

  // Categories for the dropdown
  categories = signal([
    { id: '1', name: 'Ropa' },
    { id: '2', name: 'Accesorios' },
    { id: '3', name: 'Electrónica' },
  ]);

  // Form validation
  isFormValid = computed(() => {
    const state = this.formState();
    return (
      state.name &&
      state.name.length >= 3 &&
      state.price !== null &&
      state.price > 0 &&
      state.description &&
      state.description.length >= 10 &&
      state.stock !== null &&
      state.stock >= 0 &&
      state.category
    );
  });

  constructor() {
    // Update form when product input changes
    effect(() => {
      const product = this.product();
      if (product) {
        this.formState.set({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          stock: product.stock,
          category: product.category,
          image: product.image || '',
          status: product.status,
        });
      } else {
        this.resetForm();
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // Helper method to update form state
  updateFormState(
    updates: Partial<{
      name: string;
      price: number;
      description: string;
      stock: number;
      category: string;
      image: string | File;
    }>
  ) {
    this.formState.update((state) => ({
      ...state,
      ...updates,
    }));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor, selecciona un archivo de imagen válido (JPEG, PNG o WebP)');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result || null;
      };
      reader.readAsDataURL(this.selectedFile);

      // Update form state with file
      this.updateFormState({ image: this.selectedFile });
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.updateFormState({ image: '' });
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.isFormValid()) {
      return;
    }

    const { name, price, description, stock, category, image } = this.formState();

    if (!image) {
      alert('Por favor, selecciona una imagen para el producto');
      return;
    }

    if (this.product()?.id) {
      this.productService.updateProduct(this.formState());
    } else {
      this.productService.addProduct(this.formState());
    }
    this.resetForm();
    this.close.emit();
    this.removeImage();
  }

  closeModal(): void {
    this.close.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.formState.set({
      name: '',
      price: 0,
      description: '',
      stock: 0,
      category: '',
      image: '',
      status: 'active',
    });
    this.removeImage();
  }
}
