import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from '../search/search';
import { Router, RouterLink } from "@angular/router";
//importando logica para datos de btn perfil
import { getUserDataLocal, deleteUserData } from './logic/btnPerfil';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule, Search, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  private router: Router = inject(Router);
  private fireAuth: Auth = inject(Auth);

ngOnInit(): void {
  this.initBtnUser();
}
  // variable: controlar menu (nav) en tablet y mobil
  menu = false
  // funcion: control de vista de menu
  toggleMenu (){
    this.menu = !this.menu
  }

  // variable: controlar modal de btn perfil
  showUserMenu = false;
  // funcion: control hobver de menu (btn perfil)
  leaveUserMenu():void{
    setTimeout(()=>{
      this.showUserMenu = false
    },200)
  }

  // Control del botón de login / perfil
  src: string = ``;     // URL de la foto del usuario
  route: string = ``;   // Ruta de navegación según el rol

  // Navega hacia la ruta asignada
  navigate() {
    this.router.navigate([`/${this.route}`]);
  }

  // Controlador del botón de usuario (login o panel)
  initBtnUser() {
    // Obtener datos del usuario guardados en localStorage
    const data = getUserDataLocal();

    // Si no hay sesión iniciada
    if ('result' in data) {
      this.route = `/login`;
      return;
    }

    // Asignar ruta según el rol del usuario
    if (data.rol === `usuario`) {
      this.route = `/user`;
    } else {
      this.route = `/admin`;
    }

    // Asignar foto del usuario
    this.src = data.photo;
  }

  // Cerrar sesión del usuario
  async signOut() {
    try {
      // Cierra sesión con Firebase Auth
      await signOut(this.fireAuth);
      console.log(`Sesión cerrada con éxito`);

      // Elimina datos locales del usuario
      deleteUserData();
    } catch (error) {
      console.error(`Error al cerrar sesión`, error);
    }
  }

}