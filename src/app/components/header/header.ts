import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from '../search/search';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/service/cart/cart';
import { CartDropdown } from '../cart-dropdown/cart-dropdown';
import { ButtonTheme } from '../button-theme/button-theme';
import { LucideAngularModule, TextAlignJustify, UserRound } from 'lucide-angular';
import { IconTienda } from "../../icons/icon-tienda/icon-tienda";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Search, CartDropdown, RouterLink, ButtonTheme, LucideAngularModule, IconTienda],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  menu = false;
  TextAlignJustify = TextAlignJustify;
  UserRound = UserRound;
  totalCartItems = 0;

  showCartDropdown = true;

  toggleCartDropdown() {
    this.showCartDropdown = !this.showCartDropdown;
  }

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
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
}
