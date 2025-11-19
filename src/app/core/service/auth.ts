import { Injectable, inject, Injector } from '@angular/core';
import { runInInjectionContext } from '@angular/core'; // Para tu app zoneless
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

// Importa Firebase (SOLO para el pop-up de Google)
import {
  Auth as FirebaseAuth, // Alias para evitar conflicto de nombres
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  getAuth
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // --- Servicios Inyectados ---
  private fireAuth: FirebaseAuth = inject(FirebaseAuth); // Para Google Pop-up
  private http: HttpClient = inject(HttpClient); // Para llamar al Backend
  private injector: Injector = inject(Injector); // Para el contexto zoneless

  // La URL base de tu líder
  private apiUrl =

  //  se quito auth para separar responsavilidad de acion
    'http://localhost:3000/v1';

  constructor() {}

  // --- Flujo de Email/Password (Llama al Backend) ---

  /**
   * Llama al endpoint del backend para registrar un nuevo usuario.
   */
  register(data: any): Observable<any> {
    // Esta ruta SÍ existe en el nuevo repo (POST .../v1/auth/register)
    return this.http.post(this.apiUrl + '/auth/register', data);
  }

  /**
   * Llama al endpoint del backend para iniciar sesión.
   */
  login(data: any): Observable<any> {
    // Esta ruta SÍ existe en el nuevo repo (POST .../v1/auth/login)
    return this.http.post(this.apiUrl + '/auth/login', data);
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
    const request$ = this.http.post(`${this.apiUrl}/auth/`, {}, { headers });
    return firstValueFrom(request$);
  }

  // funcion para obtener token de usuario
  async getUserToken(): Promise<string> {
    try {
      const auth = getAuth();
      const data = auth.currentUser;

      if (!data) return "no-auth";

      const token = await data.getIdToken();
      return token;

    } catch (err) {
      console.error("Error getting UID:", err);
      return "no-auth";
    }
  }

  // funcion para obtener uid de usuario
  async getUserUid(): Promise<string> {
    try {
      const auth = getAuth();
      const data = auth.currentUser;

      if (!data) return "no-auth";

      const uid = await data.uid;
      return uid;

    } catch (err) {
      console.error("Error getting UID:", err);
      return "no-auth";
    }
  }

  // funcion para obtener uid de usuario
  async getUserPhoto(): Promise<string |null> {
    try {
      const auth = getAuth();
      const data = auth.currentUser;

      if (!data) return "no-auth";

      const token:string|null = await data.photoURL;
      return token;

    } catch (err) {
      console.error("Error getting UID:", err);
      return "no-auth";
    }
  }

  // funcion para obtener rol de usuario logeado
  async getUserRol(uid: string): Promise<string> {
    try {
      const apiResponse: any = await firstValueFrom(
        this.http.get(this.apiUrl + `/usuario/${uid}`)
      );

      const rol = apiResponse?.rol;

      if (rol === 'admin' || rol === 'usuario') {
        return rol;
      }

      return 'unknown';
    } catch (error) {
      console.error('Error obteniendo rol:', error);
      return 'unknown';
    }
  }

  // funcion para obtener rol de usuario logeado
async guardUserRol(token: string): Promise<string> {
  try {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Token enviado en header
    });

    // Llamada al endpoint del backend para obtener el rol
    const response: any = await firstValueFrom(
      this.http.get(`${this.apiUrl}/auth/me/rol`, { headers })
    );
    // Extraemos el rol de la respuesta
    const rol = response?.rol;

    if (rol === 'admin' || rol === 'usuario') {
      return rol;
    }
    // Si el rol no es válido, retornamos 'unknown'
    return 'unknown';
  } catch (error) {
    console.error('Error obteniendo rol:', error);
    return 'unknown';
  }
}

  
  //funcion para guardar en cookies
  sabeCookies(name: string, data: string): void {
    const encoded = encodeURIComponent(data);
    document.cookie = `${name}=${encoded}; Path=/; Max-Age=86400; SameSite=Lax`;
    console.log("COOKIE GUARDADA:", name);
  }

  //funcion para extraer datos de cookies
  getCookie(name: string): string | null {
    const value = document.cookie
      .split("; ")
      .find(c => c.startsWith(name + "="));

    return value ? decodeURIComponent(value.split("=")[1]) : null;
  }
  // funcion para borrar cookie
  deleteCookie(name: string): void {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
  }


}