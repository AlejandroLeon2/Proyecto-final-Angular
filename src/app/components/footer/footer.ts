import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  email: string = '';

    shopLinks = [
      { label: 'Nuevos Lanzamientos', url: '/shop/home' },
      { label: 'Ofertas', url: '/deals' },
      { label: 'Categorias', url: '/shop/categorias-product' }
    ];

  aboutLinks = [
      { label: 'Sobre Nosotros', url: '/about' },
      { label: 'Contacto', url: '/contact' },
      { label: 'Preguntas frecuentes', url: '/faq' }
    ];

  legalLinks = [
      { label: 'Terminos y condiciones', url: '/terms' },
      { label: 'Politica de privacidad', url: '/privacy' }
    ];

  subscribe() {
    if (this.email) {
      console.log(`Subscribed with email: ${this.email}`);
      
      
      alert('Gracias por suscribirte');

      this.email = '';
    }
  }
}
