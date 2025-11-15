import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { IconBrandLogo } from '../../../icons/IconBrandLogo/IconBrandLogo';
import { Auth } from '../../../core/service/auth/auth';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IconBrandLogo 
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register implements OnInit {
  
  registerForm!: FormGroup; 

  private fb: FormBuilder = inject(FormBuilder);
  private auth: Auth = inject(Auth); 
  private router: Router = inject(Router);

  constructor() {} 

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // Getters
  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }

  // --- Método de envío (Email/Pass) ---
  onSubmit(): void { // 1. Ya no es async
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // 2. Llama al método 'register' y usa .subscribe()
    this.auth.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('¡Registro exitoso (Backend)!', response);
        // 3. Redirige al Login
        this.router.navigate(['/login']); 
      },
      error: (error: any) => {
        console.error('Error en el registro:', error);
        
      }
    });
  }
}