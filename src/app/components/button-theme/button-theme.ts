import { Component } from '@angular/core';
import { LucideAngularModule, SunIcon } from "lucide-angular";

@Component({
  selector: 'app-button-theme',
  imports: [LucideAngularModule],
  templateUrl: './button-theme.html',
  styleUrl: './button-theme.css',
})
export class ButtonTheme {
theme: 'light' | 'dark' = 'light';
SunIcon = SunIcon;
  toggleTheme() {
    // Cambia el valor
    this.theme = this.theme === 'light' ? 'dark' : 'light';

    // Cambia el atributo del body
    document.body.setAttribute('data-theme', this.theme);
  }
}
