import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, SunIcon, MoonStar } from 'lucide-angular';
@Component({
  selector: 'app-button-theme',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './button-theme.html',
  styleUrl: './button-theme.css',
})
export class ButtonTheme implements OnInit {

  constructor() {}  
  ngOnInit(): void {
    // obtenemos el tema guardado en localStorage o por defecto 'light'
    this.theme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    // Establece el atributo del body al cargar el componente
    document.body.setAttribute('data-theme', this.theme);
  }

  theme: 'light' | 'dark' = 'light';
  SunIcon = SunIcon;
  MoonStar = MoonStar;
  toggleTheme() {
    // Cambia el valor
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);

    // Cambia el atributo del body
    document.body.setAttribute('data-theme', this.theme);
  }
}
