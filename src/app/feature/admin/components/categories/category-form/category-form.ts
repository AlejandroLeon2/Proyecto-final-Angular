import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../../../core/models/category.model';
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

  form = this.fb.group({
    name: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z0-9]+$'),
        ],
        updateOn: 'blur',
      },
    ],
    description: [
      '',
      {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)],
        updateOn: 'blur',
      },
    ],
    status: ['active', Validators.required],
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

  onSubmit() {
    if (this.form.valid) {
      console.log('Formulario válido');
    } else {
      console.log('Formulario inválido');
      this.form.markAllAsTouched();
    }
  }

  closeModal() {
    this.modalService.close();
  }
}
