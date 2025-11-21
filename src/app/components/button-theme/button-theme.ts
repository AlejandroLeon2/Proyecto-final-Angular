import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule, SunIcon, MoonStar } from 'lucide-angular';
@Component({
  selector: 'app-button-theme',
  imports: [LucideAngularModule, NgClass],
  templateUrl: './button-theme.html',
  styleUrl: './button-theme.css',
})
export class ButtonTheme {
  theme: 'light' | 'dark' = 'light';
  SunIcon = SunIcon;
  MoonStar = MoonStar;
  toggleTheme() {
    // Cambia el valor
    this.theme = this.theme === 'light' ? 'dark' : 'light';

    // Cambia el atributo del body
    document.body.setAttribute('data-theme', this.theme);
  }
}
