import { Component } from '@angular/core';
import { CartDropdown } from '../../components/cart-dropdown/cart-dropdown';

@Component({
  selector: 'app-cart',
  imports: [ CartDropdown ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

}
