import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from '../search/search';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [CommonModule, Search, RouterLink],
  templateUrl: './header.html',
  styleUrls: [ './header.css'],
})
export class Header {

  menu = false
  theme: 'light' | 'dark' = 'light';

  showUserMenu = false;
  isDark = false;
  leaveUserMenu():void{
    setTimeout(()=>{
      this.showUserMenu = false
    },200)
  }

  toggleMenu (){
    this.menu = !this.menu
  }
  toggleTheme() {
    // Cambia el valor
    this.theme = this.theme === 'light' ? 'dark' : 'light';

    // Cambia el atributo del body
    document.body.setAttribute('data-theme', this.theme);
  }
}
