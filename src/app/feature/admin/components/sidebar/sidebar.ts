import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  House,
  LogOut,
  LucideAngularModule,
  Menu,
  Package2,
  Shapes,
  ShoppingCart,
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, LucideAngularModule, RouterLink, RouterLinkActive],

  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  dashboardIcon = House;
  productIcon = Package2;
  categoryIcon = Shapes;
  orderIcon = ShoppingCart;
  logoutIcon = LogOut;
  menuIcon = Menu;

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
