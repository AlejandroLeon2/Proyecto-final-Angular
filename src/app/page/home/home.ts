import { Component } from '@angular/core';
import { HeroCarrusel } from '../../components/hero-carrusel/hero-carrusel';

@Component({
  selector: 'app-home',
  imports: [ HeroCarrusel ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
