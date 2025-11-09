import { Component } from '@angular/core';

@Component({
  selector: 'app-icon-google-logo',
  template: `
    <!-- Icono simple de Google (Solo la 'G') -->
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-full h-full">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.75 5.37 2.76 13.24l7.84 6.06C12.43 13.72 17.79 9.5 24 9.5z"></path>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h12.8c-.57 2.87-2.3 5.37-4.64 6.98l7.35 5.71C44.77 35.9 46.98 30.61 46.98 24.55z"></path>
      <path fill="#FBBC05" d="M10.6 28.59c-.27-.82-.42-1.7-.42-2.59s.15-1.77.42-2.59l-7.84-6.06C1.16 19.13 0 21.47 0 24c0 2.53.98 4.87 2.76 6.67l7.84-6.08z"></path>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.35-5.71c-2.13 1.44-4.84 2.29-7.54 2.29-6.21 0-11.57-4.22-13.46-9.91l-7.84 6.06C6.75 42.63 14.62 48 24 48z"></path>
      <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
  `
})
export class IconGoogleLogo {}