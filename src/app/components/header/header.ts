import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from '../search/search';
import { Router, RouterLink } from "@angular/router";
//importando logica para datos de btn perfil
import { deleteUserData } from './logic/btnPerfil';
import { Auth, signOut } from '@angular/fire/auth';
import { Auth as authService } from '../../core/service/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule, Search, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  private router: Router = inject(Router);
  private fireAuth: Auth = inject(Auth);
  private auth: authService = inject(authService);

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
  userMenu = false;
  crono:number = 0;

  showUserMenu():void{
    this.userMenu = true;
    clearTimeout(this.crono);
  }

  // funcion: control hobver de menu (btn perfil)
  leaveUserMenu():void{

    this.crono = setTimeout(()=>{
      this.userMenu = false
    },300)
  }

  // Control del botón de login / perfil
  src: string|null = ``;     // URL de la foto del usuario
  route: string = ``;   // Ruta de navegación según el rol

  // Navega hacia la ruta asignada
  navigate() {
    this.router.navigate([`/${this.route}`]);
  }

  // Controlador del botón de usuario (login o panel)
  initBtnUser() {
    // Obtener datos del usuario guardados en localStorage
    const token = this.auth.getCookie(`token`);
    const rol = this.auth.getCookie(`rol`);
    // Si no hay sesión iniciada
    if (!token) {
      this.route = `/login`;
      return;
    }

    // Asignar ruta según el rol del usuario
    if (rol === `usuario`) {
      this.route = `/user`;
      
    } else {
      this.route = `/admin`;
    }

    // Asignar foto del usuario
    // Leer el JSON desde localStorage
    const stored = localStorage.getItem('auth');

    if (stored) {
      const data = JSON.parse(stored); // ← aquí sí se convierte a objeto
      this.src = data.photoURL ?? '';  // ← si no existe, asigna string vacío
    } else {
      this.src = '';
    }

  }

  // Cerrar sesión del usuario
  async signOut() {
    try {
      // Cierra sesión con Firebase Auth
      await signOut(this.fireAuth);
      console.log(`Sesión cerrada con éxito`);
      // Elimina datos locales del usuario
      deleteUserData();
      this.auth.deleteCookie(`token`);
      this.auth.deleteCookie(`uid`);
      this.auth.deleteCookie(`rol`);
      //redireccionado a  login
      this.router.navigate([`/login`]);
    } catch (error) {
      console.error(`Error al cerrar sesión`, error);
    }
  }

}