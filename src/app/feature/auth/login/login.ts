import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IconBrandLogo } from '../../../icons/IconBrandLogo/IconBrandLogo';
import { IconGoogleLogo } from '../../../icons/IconGoogleLogo/IconGoogleLogo';
import { Auth } from '../../../core/service/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconBrandLogo, IconGoogleLogo],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  loginForm!: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // Getters
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  // --- Método de envío (Email/Pass) ---
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.auth.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('¡Login (Email/Pass) exitoso!', response);
        // TODO: Guardar el token que envíe el backend
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error('Error en el login (Email/Pass):', error);
      },
    });
  }

  // --- Método de Google (FLujo Híbrido) ---
  async onGoogleLogin(): Promise<void> {
    try {
      // --- PASO 1: Autenticar con Firebase (Frontend) ---
      const userCredential = await this.auth.loginWithGoogle();
      console.log('¡Login con Google exitoso (Paso 1)!', userCredential.user);

      // --- PASO 2: Enviar Token al Backend ---
      console.log('Enviando token al backend (Paso 2)...');
      const token = await userCredential.user.getIdToken();

      // --- ¡¡AQUÍ ESTÁ LA CAPTURA DEL TOKEN!! ---
      console.log('****************************************');
      console.log('TOKEN CAPTURADO:');
      console.log(token);
      console.log('****************************************');
      // --- FIN DE LA CAPTURA ---

      const backendResponse = await this.auth.saveGoogleUserToDb(token);
      console.log('Respuesta del backend (Paso 2):', backendResponse);

      // condicion para redirigir a admin o user

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

      const rol: string = await this.auth.getUserRol(userCredential.user.uid);
      console.log(rol);

      if (rol === `usuario`) {

        this.router.navigate(['/user']);
      }

      if (rol === `admin`) {
        this.router.navigate(['/admin']);
      }
    } catch (error: any) {
      console.error('Error en el flujo de Google:', error);
    }
  }
}
