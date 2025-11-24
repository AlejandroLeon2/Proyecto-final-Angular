import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LogOut,
  LucideAngularModule,
  SquareChartGantt,
  TextAlignJustify,
  UserRound,
} from 'lucide-angular';
import { Auth } from '../../core/service/auth/auth';
import { CartService } from '../../core/service/cart/cart';
import { IconTienda } from '../../icons/icon-tienda/icon-tienda';
import { ButtonTheme } from '../button-theme/button-theme';
import { CartDropdown } from '../cart-dropdown/cart-dropdown';
import { Search } from '../search/search';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    Search,
    CartDropdown,
    RouterLink,
    ButtonTheme,
    LucideAngularModule,
    IconTienda,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  //inyección de servicio auth
  private auth: Auth = inject(Auth);
  private rout: Router = inject(Router);
  //iconos lucide
  TextAlignJustify = TextAlignJustify;
  UserRound = UserRound;
  LogOut = LogOut;
  SquareChartGantt = SquareChartGantt;

  totalCartItems = 0;

  //variable para mostrar/ocultar menu en pantallas pequeñas
  menu = false;
  //variable contenedor de src de perfil de usuario
  //variable para mostrar/ocultar dropdown del carrito
  showCartDropdown = true;
  showUserMenu = false;
  toggleCartDropdown() {
    this.showCartDropdown = !this.showCartDropdown;
  }

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    //cargar src de perfil de usuario
    this.cartService.items$.subscribe((items) => {
      this.totalCartItems = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }
  get role() {
    return this.auth.role(); // devuelve 'usuario', 'admin', etc.
  }

  get profileRoute() {
    switch (this.role) {
      case 'usuario':
        return '/user/profile';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  }
  get orderRoute() {
    switch (this.role) {
      case 'usuario':
        return '/user/orders';
      default:
        return '/login';
    }
  }

  get user() {
    return this.auth.user();
  }

  get src() {
    return this.user?.photoURL ?? '';
  }

  leaveUserMenu(): void {
    setTimeout(() => {
      this.showUserMenu = false;
    }, 200);
  }

  toggleMenu() {
    this.menu = !this.menu;
  }

  //metodo para logout
  async closeLog(): Promise<void> {
    await this.auth.logOut();
    this.rout.navigate(['/login']);
  }

  //metodo para redirigir a ubicacion anteriror despues de login o register
  redirectAfterAuth(route: string): void {
    localStorage.setItem(`previousUrl`, this.rout.url);
    this.rout.navigate([`/${route}`]);
  }
}
