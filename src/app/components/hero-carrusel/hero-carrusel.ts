import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselSlide { //mover la interface a otro lado
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

@Component({
  selector: 'app-hero-carrusel',
  imports: [ CommonModule ],
  templateUrl: './hero-carrusel.html',
  styleUrl: './hero-carrusel.css',
})
export class HeroCarrusel implements OnInit, OnDestroy {

  currentIndex: number = 0;
  autoplayInterval: any;
  autoplayDelay: number = 90000; // 90 seconds

  slides: CarouselSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop',
      title: '¡Mega Ofertas de Temporada!',
      description: 'Hasta 50% de descuento en productos seleccionados',
      buttonText: 'Comprar Ahora',
      buttonLink: '#ofertas'
    },
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop',
      title: 'Nueva Colección 2024',
      description: 'Descubre las últimas tendencias en moda',
      buttonText: 'Ver Colección',
      buttonLink: '#coleccion'
    },
    {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=600&fit=crop',
      title: 'Tecnología de Última Generación',
      description: 'Los mejores gadgets al mejor precio',
      buttonText: 'Explorar',
      buttonLink: '#tecnologia'
    },
    {
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=600&fit=crop',
      title: 'Envío Gratis',
      description: 'En compras mayores a S/.250.00',
      buttonText: 'Ver Más',
      buttonLink: '#envio'
    }
  ];

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  previousSlide() {
    this.currentIndex = this.currentIndex === 0 
      ? this.slides.length - 1 
      : this.currentIndex - 1;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.stopAutoplay();
    this.startAutoplay();
  }
}
