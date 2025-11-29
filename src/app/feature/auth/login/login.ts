//ChangeDetectionStrategy para optimizar la detección de cambios
//FormBuilder es un servicio-ayudante
//Validators es un objeto que contiene funciones de validación estáticas como required, email, minLength, etc.
//ReactiveFormsModule es un Módulo. Es una "caja de herramientas" completa para usar Formularios Reactivos.
//UserCredential es una interfaz que representa las credenciales del usuario devueltas por Firebase después de la autenticación.

import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/service/auth/auth';
import { IconTienda } from '../../../icons/icon-tienda/icon-tienda';
import { IconGoogleLogo } from '../../../icons/IconGoogleLogo/IconGoogleLogo';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconGoogleLogo, IconTienda],
  templateUrl: './login.html',
  styleUrl: './login.css',

  //ChangeDetectionStrategy.OnPush: Es la estrategia. Solo revisa cambios cuando:
  // 1) Un @Input() cambia.
  // 2) Un evento que se dispare dentro de este componente como (ngSubmit).
  // 3) Un Observable al que se suscriba con el pipe async que emite un valor".
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  // --- Inyecciones ---
  private fb: FormBuilder = inject(FormBuilder);
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  private location:Location = inject(Location);

  // --- Signals ---
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  //se crean los controles del formulario reactivo
  loginForm = this.fb.group({
    //loginForm es un objeto que representa el formulario reactivo.
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // --- Getters ---
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  // --- Método de envío (Email/Pass) ---
  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      //si el formulario es inválido
      this.loginForm.markAllAsTouched(); //marcar todos los campos como tocados para mostrar los mensajes de error
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      // --- PASO 1: Autenticar con Firebase (Frontend) ---
      const userCredential = await this.auth.loginWithEmail(this.loginForm.value);
      //Espera a que Firebase genere un token de identificación para este usuario.
      const token = await userCredential.user.getIdToken();

      await this.auth.validateAndSaveUserToDb(token);
      const rol = await this.auth.guardUserRol(token);
  
      switch (rol) {
        case 'admin':
          this.router.navigateByUrl("/admin/products");
          break;
        case 'usuario':
          this.router.navigateByUrl("/shop/home");
          break;
          default:
      }
    } catch (error: any) {
      console.error('Error en el login (Email/Pass):', error);
      this.errorMessage.set('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // --- Método de Google---
  async onGoogleLogin(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      // --- PASO 1: Autenticar con Firebase (Frontend) ---
      const userCredential = await this.auth.loginWithGoogle();
      const token = await userCredential.user.getIdToken();

      await this.auth.validateAndSaveUserToDb(token);
      const rol = await this.auth.guardUserRol(token);
  
      switch (rol) {
        case 'admin':
          this.router.navigateByUrl("/admin/products");
          break;
        case 'usuario':
          this.router.navigateByUrl("/shop/home");
          break;
          default:
      }
    } catch (error: any) {
      console.error('Error en el flujo de Google:', error);
      this.errorMessage.set('Error al iniciar sesión con Google. Inténtalo de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // --- MÉTODO REUTILIZABLE! ---

  //Maneja la lógica común post-autenticación (Guardar en localStorage,
  //obtener rol y redirigir).

  //recibe las credenciales del usuario autenticado como argumento.

  // --- Password Recovery ---
  showRecoverModal = signal(false);
  recoverSuccessMessage = signal<string | null>(null);
  recoverEmailControl = this.fb.control('', [Validators.required, Validators.email]);

  toggleRecoverModal() {
    this.showRecoverModal.update((v) => !v);
    if (this.showRecoverModal()) {
      this.recoverEmailControl.reset();
      this.recoverSuccessMessage.set(null);
      this.errorMessage.set(null);
    }
  }

  async onRecoverPassword() {
    if (this.recoverEmailControl.invalid) {
      this.recoverEmailControl.markAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.recoverSuccessMessage.set(null);

    const email = this.recoverEmailControl.value!;

    try {
      await this.auth.recoverPassword(email);
      // Mensaje genérico por seguridad (OWASP)
      this.recoverSuccessMessage.set(
        'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.'
      );
      // Opcional: Cerrar modal después de unos segundos
      // setTimeout(() => this.toggleRecoverModal(), 5000);
    } catch (error) {
      console.error('Error recovering password:', error);
      // Incluso si falla (ej. usuario no encontrado), mostramos éxito o un error genérico
      // para no revelar información. Solo mostramos error real si es algo de red/servidor crítico.
      this.recoverSuccessMessage.set(
        'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
  goBack(): void {
    this.location.back();
  }
}
