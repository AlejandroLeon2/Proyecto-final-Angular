import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../../../core/models/category.model';
import { STATUS } from '../../../../../core/models/status.model';
import { CategoriesService } from '../../../../../core/service/categories/categories';
import { ModalService } from '../../modal/service/modal';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  category = input<Category>();

  modalService = inject(ModalService);
  fb = inject(FormBuilder);
  categoryService = inject(CategoriesService);

  form = this.fb.group({
    name: [
      '',
      {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'change',
      },
    ],
    description: [
      '',
      {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)],
        updateOn: 'change',
      },
    ],
    status: [true, Validators.required],
  });

  get name() {
    return this.form.get('name')!;
  }
  get description() {
    return this.form.get('description')!;
  }
  get status() {
    return this.form.get('status')!;
  }

  constructor() {
    effect(() => {
      const category = this.category();
      if (category) {
        this.form.patchValue({
          name: category.name,
          description: category.description,
          status: category.status === STATUS.active,
        });
      } else {
        this.form.reset({
          name: '',
          description: '',
          status: true, // Default to checked (active)
        });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const status = this.form.get('status')?.value ? STATUS.active : STATUS.inactive;

      if (this.category()?.id) {
        const category: Category = {
          id: this.category()?.id!,
          name: this.form.value.name!,
          description: this.form.value.description!,
          status,
        };
        this.categoryService.updateCategory(category);
      } else {
        const category: Category = {
          id: this.category()?.id!,
          name: this.form.value.name!,
          description: this.form.value.description!,
          status,
        };
        this.categoryService.addCategory(category);
      }
      this.form.reset();
      this.modalService.close();
    } else {
      console.log('Formulario inválido');
      this.form.markAllAsTouched();
    }
  }

  closeModal() {
    this.modalService.close();
  }
}
