import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckIcon, LucideAngularModule, XIcon } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { Product } from '../../../../../core/models/product.model';
import { CategoriesService } from '../../../../../core/service/categories/categories';
import { ProductsService } from '../../../../../core/service/products/products';
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class Form implements OnInit, OnDestroy {
  // Input signals with default values
  product = input<Product | null>(null);

  // Output signals
  close = output<void>();
  submitForm = output<Product>();
  categoriesService = inject(CategoriesService);
  productService = inject(ProductsService);

  subscriptions: Subscription = new Subscription();

  removeIcon = XIcon;

  // File upload reference
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  productForm!: FormGroup;
  categories = computed(() => this.categoriesService.categories());
  checkIcon = CheckIcon;

  ngOnInit(): void {
    this.categoriesService.getCategories();
  }

  // Form validation
  isFormValid(): boolean {
    return this.productForm.valid;
  }

  constructor(private fb: FormBuilder) {
    this.initializeForm();

    // Update form when product input changes
    effect(() => {
      const product = this.product();
      if (product) {
        this.productForm.patchValue({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          stock: product.stock,
          category: product.category.id,
          image: product.image || '',
          status: product.status === 'active',
        });
      } else {
        this.resetForm();
      }
    });
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: [''],
      status: [true], // true for active, false for inactive
      imageFile: [null],
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // Getter for easy access to form controls
  get f() {
    return this.productForm.controls;
  }

  // Check if a form field is invalid and has been touched
  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      this.productForm.patchValue({
        imageFile: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = e.target?.result || null);
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.productForm.patchValue({
      image: '',
      imageFile: null,
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.isFormValid()) {
      // Mark all fields as touched to show validation messages
      Object.values(this.productForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    const formValue = {
      ...this.productForm.value,
      status: this.productForm.value.status ? 'active' : 'inactive',
    };

    // If there's a new image file, include it in the form data
    if (this.selectedFile) {
      formValue.imageFile = this.selectedFile;
    }

    if (this.product()?.id) {
      this.productService.updateProduct({ ...formValue, id: this.product()?.id });
    } else {
      this.productService.addProduct(formValue);
    }

    this.submitForm.emit(formValue);
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.productForm.reset({
      name: '',
      price: 0,
      description: '',
      stock: 0,
      category: '',
      image: '',
      status: true,
      imageFile: null,
    });
    this.previewUrl = null;
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
