import { Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from '../search/search';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../core/service/cart/cart';
import { CartDropdown } from '../cart-dropdown/cart-dropdown';
import { ButtonTheme } from '../button-theme/button-theme';
import { LucideAngularModule, TextAlignJustify, UserRound, LogOut } from 'lucide-angular';
import { IconTienda } from "../../icons/icon-tienda/icon-tienda";
import { Auth } from '../../core/service/auth/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Search, CartDropdown, RouterLink, ButtonTheme, LucideAngularModule, IconTienda],
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

  totalCartItems = 0;

  //variable para mostrar/ocultar menu en pantallas pequeñas
  menu = false;
  //variable contenedor de src de perfil de usuario
  src = ``;
  //variable para mostrar/ocultar dropdown del carrito
  showCartDropdown = true;

  toggleCartDropdown() {
    this.showCartDropdown = !this.showCartDropdown;
  }

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    //cargar src de perfil de usuario
    this.loadUserProfileSrc();

    this.cartService.items$.subscribe((items) => {
      this.totalCartItems = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  showUserMenu = false;
  leaveUserMenu(): void {
    setTimeout(() => {
      this.showUserMenu = false;
    }, 200);
  }

  toggleMenu() {
    this.menu = !this.menu;
  }

  //metodo para cargar src de perfil de usuario desde localstorage
  loadUserProfileSrc(): void {
    const localData = localStorage.getItem('auth');
    
    if (!localData) {
      return;
    }
    const authData = JSON.parse(localData);

    console.log(authData.photoURL);
    
    this.src = authData.photoURL;
  }

  //metodo para logout
  async closeLog(): Promise<void> {
    try {
      await this.auth.logOut();
      localStorage.removeItem('auth');
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
    }   
  }

  //metodo para redirigir a ubicacion anteriror despues de login o register
  redirectAfterAuth(route:string): void {
    localStorage.setItem( `previousUrl`, this.rout.url );
    this.rout.navigate([`/${route}`]);
  }
}
