import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';//HttpHeaders se usa para enviar el token de autorización en la cabecera
import { firstValueFrom, Observable } from 'rxjs';//firstValueFrom se usa para convertir un Observable en una Promesa y retornar el primer valor emitido
import {
  Auth as FirebaseAuth, // Alias para evitar conflicto de nombres
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  // Importamos la función para hacer login con email/pass desde el SDK de CLIENTE
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private fireAuth: FirebaseAuth = inject(FirebaseAuth); // Para Google Pop-up y Email
  private http: HttpClient = inject(HttpClient); // Para llamar al Backend

  // --- Flujo de Registro (Llama al Backend) ---
  
  register(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/auth/register', data);
  }

  // --- ¡MÉTODO ELIMINADO! ---
  /*
  login(data: any): Observable<any> {
    return this.http.post(environment.apiURL + '/auth/login', data);
  }
  */

  // --- ¡NUEVO MÉTODO! ---
  /**
   * Paso 1 (Frontend): Llama a FIREBASE AUTH con Email/Pass.
   * Esta es la contraparte de 'loginWithGoogle'.
   */

  loginWithEmail(data: any): Promise<UserCredential> {
  // Llamada directa usando la instancia ya inyectada
  return signInWithEmailAndPassword(this.fireAuth, data.email, data.password);
}

  // --- Flujo de Google (Frontend de Firebase + Backend) ---

  /**
   * Paso 1 (Frontend): Muestra el Pop-up de Google usando Firebase.
   * (Este método no cambia)
   */

  loginWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(this.fireAuth, new GoogleAuthProvider());
}

  /**
   * Paso 2 (Backend): Envía el token de Firebase al backend para guardarlo/validarlo.
   * (Este método fue RENOMBRADO de 'saveGoogleUserToDb' a 'validateAndSaveUserToDb')
   * ¡Ahora lo reutilizan tanto el login de Google como el de Email/Pass!
   */
  validateAndSaveUserToDb(token: string): Promise<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // El ID Token (de Google o de Email/Pass)
      'Content-Type': 'application/json',
    });

    // Llama al endpoint POST /v1/auth/ que usa el middleware 'verifyToken'
    const request$ = this.http.post(
      `${environment.apiURL}/auth/`,
      {}, // Body vacío, toda la info va en el token
      { headers }
    );
    return firstValueFrom(request$);
  }

  // --- Métodos de Utilidad---
  getCurrentUser() {
    return this.fireAuth.currentUser;
  }

  async getUserRol(uid: string): Promise<string> {
    const apiResponse: any = await firstValueFrom(
      this.http.get(environment.apiURL + `/usuario/${uid}`)
    );

    const rol: string = apiResponse?.rol ?? 'unknown';
    return rol;
  };

  //metodo para obtener rol por api auth/me/rol

  async guardUserRol(token: string): Promise<string> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const apiResponse: {rol:string} = await firstValueFrom(
      this.http.get<{rol:string}>(`${environment.apiURL}/auth/me/rol`, { headers })
    );
    return apiResponse.rol;
  }

  //metodo para logout
  async logOut(): Promise<void> {
    await this.fireAuth.signOut();
  }
}