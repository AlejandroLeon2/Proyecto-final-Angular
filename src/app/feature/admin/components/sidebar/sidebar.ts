import { CommonModule } from '@angular/common';
import { Component, HostListener,inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  House,
  LogOut,
  LucideAngularModule,
  Menu,
  Package2,
  Shapes,
  ShoppingCart,User
} from 'lucide-angular';
import { IconTienda } from "../../../../icons/icon-tienda/icon-tienda";
import { Auth } from '../../../../core/service/auth/auth';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, LucideAngularModule, RouterLink, RouterLinkActive],

  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly dashboardIcon = House;
  readonly productIcon = Package2;
  readonly categoryIcon = Shapes;
  readonly orderIcon = ShoppingCart;
  readonly logoutIcon = LogOut;
  readonly menuIcon = Menu;
  readonly userIcon = User;
  private authService = inject(Auth);

  user= this.authService.user;

  

  isOpen = false;
  isMobile = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  constructor() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 1024; // lg breakpoint
    if (!this.isMobile) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }
  async logout(): Promise<void> {
    await this.authService.logOut();
    

  }
  toggleMenu() {
    if (this.isMobile) {
      this.isOpen = !this.isOpen;
    }
  }

  closeMenu() {
    if (this.isMobile) {
      this.isOpen = false;
    }
  }
}
