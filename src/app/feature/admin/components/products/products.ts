import { Component } from '@angular/core';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  selector: 'app-products',
  imports: [SearchBar],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {}
