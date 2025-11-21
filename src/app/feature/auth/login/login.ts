//ChangeDetectionStrategy para optimizar la detección de cambios
//FormBuilder es un servicio-ayudante
//Validators es un objeto que contiene funciones de validación estáticas como required, email, minLength, etc.
//ReactiveFormsModule es un Módulo. Es una "caja de herramientas" completa para usar Formularios Reactivos.
//UserCredential es una interfaz que representa las credenciales del usuario devueltas por Firebase después de la autenticación.

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { UserCredential } from '@angular/fire/auth';
import { IconBrandLogo } from '../../../icons/IconBrandLogo/IconBrandLogo';
import { IconGoogleLogo } from '../../../icons/IconGoogleLogo/IconGoogleLogo';
import { Auth } from '../../../core/service/auth/auth';
import { IconTienda } from '../../../icons/icon-tienda/icon-tienda';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IconGoogleLogo,
    IconTienda,
  ],
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
  constructor(private location: Location) {}

  //se crean los controles del formulario reactivo
  loginForm = this.fb.group({
    //loginForm es un objeto que representa el formulario reactivo.
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
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

      // Llamamos al método reutilizable
      await this.handleSuccessfulLogin(userCredential); //handleSuccessfulLogin: manejar inicio de sesión exitoso.
    } catch (error: any) {
      console.error('Error en el login (Email/Pass):', error);
      // TODO: Mostrar error en la UI (ej. "Credenciales incorrectas")
    }
  }

  // --- Método de Google---
  async onGoogleLogin(): Promise<void> {
    try {
      // --- PASO 1: Autenticar con Firebase (Frontend) ---
      const userCredential = await this.auth.loginWithGoogle();
      console.log('¡Login con Google exitoso (Paso 1)!', userCredential.user);

      // --- PASO 2: Enviar Token al Backend ---
      console.log('Enviando token al backend (Paso 2)...');
      const token = await userCredential.user.getIdToken();

      const backendResponse = await this.auth.validateAndSaveUserToDb(token);
      console.log('Respuesta del backend (Paso 2):', backendResponse);

      // ✅ Llamamos al método reutilizable
      await this.handleSuccessfulLogin(userCredential);
    } catch (error: any) {
      console.error('Error en el flujo de Google:', error);
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

      // Redirigimos
      if (rol === `usuario`) {
        this.router.navigate(['/user']);
      } else if (rol === `admin`) {
        this.router.navigate(['/admin']);
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
  goBack(): void {
    this.location.back();
  }
}
