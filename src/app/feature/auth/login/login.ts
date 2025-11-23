//ChangeDetectionStrategy para optimizar la detección de cambios
//FormBuilder es un servicio-ayudante
//Validators es un objeto que contiene funciones de validación estáticas como required, email, minLength, etc.
//ReactiveFormsModule es un Módulo. Es una "caja de herramientas" completa para usar Formularios Reactivos.
//UserCredential es una interfaz que representa las credenciales del usuario devueltas por Firebase después de la autenticación.

import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { IconGoogleLogo } from '../../../icons/IconGoogleLogo/IconGoogleLogo';
import { Auth } from '../../../core/service/auth/auth';
import { IconTienda } from '../../../icons/icon-tienda/icon-tienda';
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

  // --- Signals ---
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private location: Location) { }

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
      console.log('¡Login (Email/Pass) exitoso (Paso 1)!', userCredential.user);

      // --- PASO 2: Enviar Token al Backend ---
      console.log('Enviando token al backend (Paso 2)...');

      //Espera a que Firebase genere un token de identificación para este usuario.
      const token = await userCredential.user.getIdToken();

      //Espera a que el backend (a través de auth.ts) valide ese token y guarde/actualice al usuario en la base de datos.
      const backendResponse = await this.auth.validateAndSaveUserToDb(token);
      console.log('Respuesta del backend (Paso 2):', backendResponse);
      //handleSuccessfulLogin: manejar inicio de sesión exitoso.
      this.router.navigate(['/shop/home']);
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
      console.log('¡Login con Google exitoso (Paso 1)!', userCredential.user);

      // --- PASO 2: Enviar Token al Backend ---
      console.log('Enviando token al backend (Paso 2)...');
      const token = await userCredential.user.getIdToken();

      const backendResponse = await this.auth.validateAndSaveUserToDb(token);
      console.log('Respuesta del backend (Paso 2):', backendResponse);
      this.router.navigate(['/shop/home']);
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
  private async handleSuccessfulLogin(userCredential: UserCredential): Promise<void> {
    try {
      console.log('Manejando lógica post-login...');
      // Guardamos en localStorage
      localStorage.setItem(
        'auth',
        JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          emailVerified: userCredential.user.emailVerified,
          phoneNumber: userCredential.user.phoneNumber,
          providerId: userCredential.user.providerId,
          creationTime: userCredential.user.metadata.creationTime,
          lastSignInTime: userCredential.user.metadata.lastSignInTime,

        })
      );

      // Obtenemos el rol
      const rol: string = await this.auth.getUserRol(userCredential.user.uid);
      console.log('Rol obtenido:', rol);

      // 🚨 PRIORIDAD 1: Si es ADMIN, ir directo al dashboard
      if (rol === 'admin') {
        localStorage.removeItem('previousUrl'); // Limpiar ruta previa si existía
        this.router.navigate(['/admin']);
        return;
      }

      // PRIORIDAD 2: Si hay ruta previa (y no es admin), volver ahí
      const afterRoute: string | null = localStorage.getItem('previousUrl') || null;
      if (afterRoute) {
        this.router.navigate([afterRoute]);
        localStorage.removeItem('previousUrl');
        return;
      }

      // PRIORIDAD 3: Usuario normal sin ruta previa -> Home
      if (rol === 'usuario') {
        this.router.navigate(['/']);
      } else {
        // Fallback por si el rol no es reconocido
        console.warn('Rol no reconocido, redirigiendo a la home.');
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Error durante el manejo post-login:', error);
      // Aquí podrías redirigir a una página de error o al login
      this.router.navigate(['/login']);
    }
  }
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
