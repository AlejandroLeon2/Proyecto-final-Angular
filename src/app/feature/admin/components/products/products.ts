import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../../core/service/products/products';
import { Modal } from '../modal/modal';
import { ProductsTable } from '../products-table/products-table';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  selector: 'app-products',
  imports: [SearchBar, ProductsTable, Modal],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  quickFilterText: string = '';
  isOpen = signal(false);

  productsService = inject(ProductsService);

  rowData = computed(() => this.productsService.data);

  ngOnInit(): void {
    this.productsService.getProducts();
  }

  openModal() {
    this.isOpen.set(true);
  }

  closeModal() {
    this.isOpen.set(false);
  }
}
