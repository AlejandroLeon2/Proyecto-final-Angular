import { Injectable, inject, Injector } from '@angular/core';
import { runInInjectionContext } from '@angular/core'; // Para tu app zoneless
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { signOut } from '@angular/fire/auth';
import { firstValueFrom, Observable } from 'rxjs';
import {
  Auth as FirebaseAuth, // Alias para evitar conflicto de nombres
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from '@angular/fire/auth';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // --- Servicios Inyectados ---
  private fireAuth: FirebaseAuth = inject(FirebaseAuth); // Para Google Pop-up
  private http: HttpClient = inject(HttpClient); // Para llamar al Backend
  private injector: Injector = inject(Injector); // Para el contexto zoneless

  constructor() {}

  // --- Flujo de Email/Password (Llama al Backend) ---
  /**
   * Llama al endpoint del backend para registrar un nuevo usuario.
   */
  register(data: any): Observable<any> {
    // Esta ruta SÍ existe en el nuevo repo (POST .../v1/auth/register)
    return this.http.post(environment.apiURL + '/auth/register', data);
  }

  /**
   * Llama al endpoint del backend para iniciar sesión.
   */
  login(data: any): Observable<any> {
    // Esta ruta SÍ existe en el nuevo repo (POST .../v1/auth/login)
    return this.http.post(environment.apiURL + '/auth/login', data);
  }
  // --- Flujo de Google (Frontend de Firebase + Backend) ---

  /**
   * Paso 1 (Frontend): Muestra el Pop-up de Google usando Firebase.
   */
  loginWithGoogle(): Promise<UserCredential> {
    // Envuelve la llamada en el contexto de inyección
    // para que funcione correctamente en tu app "zoneless".
    return runInInjectionContext(this.injector, () => {
      return signInWithPopup(this.fireAuth, new GoogleAuthProvider());
    });
  }
  /**
   * Paso 2 (Backend): Envía el token de Google al backend para guardarlo.
   */
  saveGoogleUserToDb(token: string): Promise<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // El token de Google
      'Content-Type': 'application/json',
    });

    // Esta ruta SÍ existe en el nuevo repo (POST .../v1/auth/)
    // Enviamos un body vacío ({}) 
    const request$ = this.http.post(`${environment.apiURL}/auth/`, {}, { headers });
    return firstValueFrom(request$);
  }
  getCurrentUser() {
  return this.fireAuth.currentUser;
}
  async getUserRol(uid:string):Promise<string>{
    const apiResponse:any = await firstValueFrom(
      this.http.get(environment.apiURL + `/usuario/${uid}`)
    );

    const rol:string = apiResponse?.rol ?? "unknown";
    return rol;
  }
}