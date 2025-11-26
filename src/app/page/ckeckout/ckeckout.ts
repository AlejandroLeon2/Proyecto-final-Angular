// ========== TYPESCRIPT: ckeckout.ts ==========
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CartService } from '../../core/service/cart/cart';
import type { CartItem } from '../../core/models/cart-item.model';
import { ModalVenta } from '../../components/modal-venta/modal-venta';
import { Router } from '@angular/router';
import { OrdersService } from '../../core/service/orders/orders';
import { toSignal } from '@angular/core/rxjs-interop';
import type { Order } from '../../core/models/order.model';
import { Auth } from '../../core/service/auth/auth';

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

@Component({
  selector: 'app-ckeckout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalVenta],
  templateUrl: './ckeckout.html',
  styleUrl: './ckeckout.css',
})
export class Ckeckout implements OnInit {
  private cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  private authService = inject(Auth);

  user = this.authService.user;

  buyerForm!: FormGroup;
  cardForm!: FormGroup;

  selectedShipping: string = 'standard';
  paymentMethod: 'card' | 'mercadopago' = 'card';

  products: CartItem[] = [];

  // Variables para el modal
  showSuccessModal: boolean = false;
  orderNumber: string = '';

  shippingMethods: ShippingMethod[] = [
    { id: 'standard', name: 'Envío Estándar', price: 0, estimatedDays: '5-7 días hábiles' },
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.initForms();
    this.cartService.items$.subscribe((items) => {
      this.products = items;
    });
  }

  // ========== VALIDADORES PERSONALIZADOS ==========

  // Validador de teléfono peruano
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const phoneRegex = /^(\+51)?[9][0-9]{8}$/;
    return phoneRegex.test(value.replace(/\s/g, '')) ? null : { invalidPhone: true };
  }

  // Validador de número de tarjeta (Luhn algorithm)
  cardNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.replace(/\s/g, '');
    if (!value) return null;

    if (!/^\d{13,19}$/.test(value)) {
      return { invalidCard: true };
    }

    let sum = 0;
    let isEven = false;

    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0 ? null : { invalidCard: true };
  }

  // Validador de fecha de expiración
  expiryValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(value)) {
      return { invalidExpiry: true };
    }

    const [month, year] = value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expYear = parseInt(year, 10);
    const expMonth = parseInt(month, 10);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return { expiredCard: true };
    }

    return null;
  }

  // Validador de solo letras
  lettersOnlyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(value) ? null : { lettersOnly: true };
  }

  initForms() {
    this.buyerForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          this.lettersOnlyValidator,
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(15),
          this.phoneValidator,
        ],
      ],
      city: ['', [Validators.required, Validators.minLength(2), this.lettersOnlyValidator]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    });

    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, this.cardNumberValidator]],
      expiry: ['', [Validators.required, this.expiryValidator]],
      cvv: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3,4}$/),
          Validators.minLength(3),
          Validators.maxLength(3),
        ],
      ],
    });
  }

  // ========== GETTERS DE ERRORES ==========

  getErrorMessage(formGroup: FormGroup, controlName: string): string {
    const control = formGroup.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['email']) return 'Correo electrónico inválido';
    if (errors['pattern']) return 'Formato inválido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['invalidPhone']) return 'Número de teléfono inválido (debe ser peruano)';
    if (errors['invalidCard']) return 'Número de tarjeta inválido';
    if (errors['invalidExpiry']) return 'Fecha de expiración inválida (MM/AA)';
    if (errors['expiredCard']) return 'La tarjeta está vencida';
    if (errors['lettersOnly']) return 'Solo se permiten letras';

    return 'Error de validación';
  }

  hasError(formGroup: FormGroup, controlName: string): boolean {
    const control = formGroup.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  // ========== CÁLCULOS ==========

  get subtotal(): number {
    return this.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }

  get shippingCost(): number {
    const method = this.shippingMethods.find((m) => m.id === this.selectedShipping);
    return method?.price || 0;
  }

  get total(): number {
    return this.subtotal + this.shippingCost;
  }

  isFormValid(): boolean {
    const buyerValid = this.buyerForm.valid;
    const paymentValid = this.paymentMethod === 'mercadopago' || this.cardForm.valid;
    return buyerValid && paymentValid && this.products.length > 0;
  }

  // ========== FORMATEO DE INPUTS ==========

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardForm.patchValue({ cardNumber: formattedValue }, { emitEvent: false });
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.cardForm.patchValue({ expiry: value }, { emitEvent: false });
  }

  formatCVV(event: any) {
    const value = event.target.value.replace(/\D/g, '');
    this.cardForm.patchValue({ cvv: value }, { emitEvent: false });
  }

  // ========== GENERADOR DE NÚMERO DE ORDEN ==========

  generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `ORD-${timestamp.slice(-6)}${random}`;
  }

  // ========== CONFIRMACIÓN ==========

  confirmOrder() {
    if (!this.isFormValid()) {
      this.buyerForm.markAllAsTouched();
      if (this.paymentMethod === 'card') {
        this.cardForm.markAllAsTouched();
      }

      // setTimeout(() => {
      //   const firstError = document.querySelector('.border-[var(--error)]');
      //   firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // }, 100);

      return;
    }
    const items = this.products.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      price: p.price,
      quantity: p.quantity,
    }));

    const nuevaOrden: Partial<Order> = {
      userId: this.user()?.uid,
      items,
      address: {
        street: this.buyerForm.value.address,
        number: '742',
        city: this.buyerForm.value.city,
      },
      total: this.total,
    };

    /*console.log('Order confirmed:', orderData);
    this.cartService.saveCart();
    alert('¡Orden confirmada! Redirigiendo al pago...');*/
    this.ordersService.createOrder(nuevaOrden).subscribe({
      next: (res) => {
        console.log('Orden creada:', res.data);
        this.orderNumber = this.generateOrderNumber();
        this.showSuccessModal = true;
      },
      error: (err) => console.error('Error creando orden:', err),
    });

    // Generar número de orden
    this.orderNumber = this.generateOrderNumber();

    // Mostrar modal
    this.showSuccessModal = true;
  }

  // ========== CERRAR MODAL ==========

  closeSuccessModal() {
    this.showSuccessModal = false;

    setTimeout(() => {
      // Limpiar formularios
      this.buyerForm.reset();
      this.cardForm.reset();

      // Vaciar carrito
      this.cartService.clearCart();

      // Redirigir al Home
      this.router.navigate(['/']);
    }, 350); // coincide con duración del fade-out
  }
}
