import { Component, computed, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../../../core/service/products/products';
import { Modal } from '../modal/modal';
import { ModalService } from '../modal/service/modal';
import { SearchBar } from '../search-bar/search-bar';
import { ProductsTable } from './products-table/products-table';

@Component({
  selector: 'app-products',
  imports: [SearchBar, ProductsTable, Modal],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  quickFilterText: string = '';

  productsService = inject(ProductsService);
  modalService = inject(ModalService);

  rowData = computed(() => this.productsService.data);

  ngOnInit(): void {
    this.productsService.getProducts();
  }

  openModal() {
    this.modalService.open();
  }

  closeModal() {
    this.modalService.close();
  }
}
