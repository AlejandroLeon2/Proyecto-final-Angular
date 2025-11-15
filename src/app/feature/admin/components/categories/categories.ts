import { Component, computed, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../../../core/service/categories/categories';
import { Modal } from '../modal/modal';
import { ModalService } from '../modal/service/modal';
import { SearchBar } from '../search-bar/search-bar';
import { CategoriesTable } from './categories-table/categories-table';

@Component({
  selector: 'app-categories',
  imports: [SearchBar, Modal, CategoriesTable],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  quickFilterText: string = '';

  categoriesService = inject(CategoriesService);
  modalService = inject(ModalService);

  rowData = computed(() => this.categoriesService.data);

  ngOnInit(): void {
    this.categoriesService.getCategories();
  }

  openModal() {
    this.modalService.open();
  }

  closeModal() {
    this.modalService.close();
  }
}
