//ChangeDetectionStrategy para optimizar la detección de cambios
//FormBuilder es un servicio-ayudante
//Validators es un objeto que contiene funciones de validación estáticas como required, email, minLength, etc.
//ReactiveFormsModule es un Módulo. Es una "caja de herramientas" completa para usar Formularios Reactivos.

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
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

  //ChangeDetectionStrategy.OnPush: Es la estrategia. Solo revisa cambios cuando: 
  // 1) Un @Input() cambia.
  // 2) Un evento que se dispare dentro de este componente como (ngSubmit).
  // 3) Un Observable al que se suscriba con el pipe async que emite un valor".
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {

  private fb: FormBuilder = inject(FormBuilder);//instancia el constructor del formulario reactivo
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  //se crean los controles del formulario reactivo
  registerForm = this.fb.group({//registerForm es un objeto que representa el formulario reactivo.

      //Validaciones para cada campo
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
  });
  
  // Getters
  get name() { return this.registerForm.get('name'); }//
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }

  // --- Método de envío (Email/Pass) ---
  //Este método fuerza a que todos los campos se marquen como "tocados" para que todos los errores aparezcan a la vez
  //si el usuario hace clic en "Registrarse" sin tocar ningun campo.
  onSubmit(): void { 
    if (this.registerForm.invalid) {//si el formulario es inválido
      this.registerForm.markAllAsTouched();//marcar todos los campos como tocados para mostrar los mensajes de error
      return;
    }

    // 2. Llama al método 'register' y usa .subscribe()
    this.auth.register(this.registerForm.value).subscribe({//this.registerForm.value: devuelve un objeto con los valores
      //next: es el "manejador de éxito". Se ejecuta si el Observable emite un valor (es decir, el backend responde exitosamente).
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