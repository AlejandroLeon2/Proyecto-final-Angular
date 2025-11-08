import { Component } from '@angular/core';
import { ProductsTable } from '../products-table/products-table';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  selector: 'app-products',
  imports: [SearchBar, ProductsTable],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {}
