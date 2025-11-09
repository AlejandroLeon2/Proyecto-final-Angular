import { NgClass } from '@angular/common';
import { Component ,output} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-user',
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar-user.html',
  styleUrl: './sidebar-user.css',
})
export class SidebarUser {
  close = false;
  logout = output<void>();
  onClose() {
    return this.close = !this.close;
  }

  onLogout() {
    this.logout.emit();
  }
  public navlinks = [
    {
      links: 'profile',
      nombre: 'Profile Details',
      title: 'Datos de usuario',
      icon:'user'
    },
    {
      links: 'orders',
      nombre: 'Orders History',
      title: 'Historial de ordenes',
      icon:'home'
    },
  ];
}
