// --- Imports existentes ---
import { 
  ApplicationConfig, 
  provideBrowserGlobalErrorListeners, 
  provideZoneChangeDetection,
  // 1. 'importProvidersFrom' ya no es necesario (a menos que importes un módulo)
  //    Lo mantenemos por si acaso, pero no para Firebase.
  importProvidersFrom
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

// --- Imports nuevos ---
import { provideHttpClient } from '@angular/common/http'; // Para tu clase Auth (email/pass)
import { environment } from '../environments/environment'; // Importa el entorno base

// Imports para Firebase (Google Login)
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';


export const appConfig: ApplicationConfig = {
  providers: [
    // --- Tus providers existentes ---
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),

    // --- Providers nuevos añadidos (CORREGIDOS) ---

    // 2. Provider para HttpClient
    provideHttpClient(),

    // 3. Providers para Firebase (¡ahora están en el nivel correcto!)
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), 
    provideAuth(() => getAuth())
    
    // 4. Si necesitaras importar un MÓDULO, iría aquí:
    // importProvidersFrom(AlgunModulo)
  ]
};