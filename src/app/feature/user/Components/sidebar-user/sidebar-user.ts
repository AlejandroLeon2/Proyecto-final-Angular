import { NgClass } from '@angular/common';
import { Component, output } from '@angular/core';
import { inject, OnInit } from '@angular/core';
import { Auth } from '../../../../core/service/auth/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-sidebar-user',
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar-user.html',
  styleUrl: './sidebar-user.css',
})
export class SidebarUser implements OnInit {
  close = false;
  logout = output<void>();
  AuthService = inject(Auth);
  name: string | null = null;
  image: string | null = null;
  email: string | null = null;
  user: User | null = null;

  ngOnInit(): void {
    this.user = this.AuthService.getCurrentUser();

    if (this.user) {
      this.name = this.user.displayName;
      this.image = this.user.photoURL;
      this.email = this.user.email;
    }
  }
  onClose() {
    return (this.close = !this.close);
  }

  onLogout() {
    this.logout.emit();
  }
  public navlinks = [
    {
      links: 'profile',
      nombre: 'Profile Details',
      title: 'Datos de usuario',
      icon: 'user',
    },
    {
      links: 'orders',
      nombre: 'Orders History',
      title: 'Historial de ordenes',
      icon: 'home',
    },
  ];
}
