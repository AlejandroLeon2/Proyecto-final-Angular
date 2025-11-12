import { Component } from '@angular/core';
import { Footer } from "../../components/footer/footer";
import { Header } from "../../components/header/header";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-shop-layout',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './shop-layout.html',
  styleUrl: './shop-layout.css',
})
export class ShopLayout {

}
