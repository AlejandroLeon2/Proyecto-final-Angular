import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Home, LogOut, LucideAngularModule, Package2, Shapes, ShoppingCart } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive],

  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  dashboardIcon = Home;
  productIcon = Package2;
  categoryIcon = Shapes;
  orderIcon = ShoppingCart;
  logoutIcon = LogOut;
}
