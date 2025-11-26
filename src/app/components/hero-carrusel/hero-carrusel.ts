import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselSlide } from '../../core/models/CarouselSlide';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-hero-carrusel',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './hero-carrusel.html',
  styleUrl: './hero-carrusel.css',
})
export class HeroCarrusel implements OnInit, OnDestroy {
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  currentIndex: number = 0;
  autoplayInterval: any;
  autoplayDelay: number = 90000; // 90 secondsfexfix

  slides: CarouselSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop',
      title: 'Catálogo Completo',
      description: 'Explora todos nuestros productos en un solo lugar',
      buttonText: 'Ver Catálogo',
      buttonLink: 'catalogo-product',
      rutahija: '',
      fragmentlink: '',
    },
    {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=600&fit=crop',
      title: 'USB BMO Retro Gamer 32GB',
      description: 'Flash drive exclusivo inspirado en Adventure Time. Diseño retro y divertido.',
      buttonText: 'Ver Detalle',
      buttonLink: 'XabOd2UuqfobqUlosRvN',
      rutahija: 'product-detail',
      fragmentlink: '',
    },
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop',
      title: 'Accesorios Únicos',
      description: 'Encuentra colgantes, soportes y más en nuestra sección de accesorios',
      buttonText: 'Ver Accesorios',
      buttonLink: 'home',
      rutahija: '',
      fragmentlink: 'accesorios',
    },
    {
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=600&fit=crop',
      title: 'Electrónica Destacada',
      description: 'Gadgets y dispositivos al mejor precio en nuestra sección de electrónica',
      buttonText: 'Ver Electrónica',
      buttonLink: 'home',
      rutahija: '',
      fragmentlink: 'electronica',
    },
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
    this.currentIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.stopAutoplay();
    this.startAutoplay();
  }
}
