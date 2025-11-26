import { Component, input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Product } from '../../../../../core/models/product.model';
import { ActionsCellRenderer } from './actions-cell-renderer';
ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

@Component({
  selector: 'app-products-table',
  imports: [AgGridAngular, FormsModule],
  templateUrl: './products-table.html',
  styleUrl: './products-table.css',
  encapsulation: ViewEncapsulation.None,
})
export class ProductsTable {
  products = input<Product[]>([]);
  gridTheme = input<string>('ag-theme-quartz');
  isDarkMode = input<boolean>(false);
  quickFilterText = input<string>('');

  private gridApi!: GridApi;
  theme = themeQuartz.withParams({
    backgroundColor: '#1f2836',
    headerBackgroundColor: '#1f2836',
  });

  columnDefs = [
    {
      field: 'id',
      hide: true,
    },
    {
      hide: true,
      field: 'image',
      headerName: 'Imagen',
      minWidth: 180,
      cellRenderer: (params: any) => {
        return `<img src="${params.value}" alt="${params.data.name}" style="width: 50px; height: 50px; object-fit: cover;" />`;
      },
    },
    {
      field: 'name',
      headerName: 'Nombre',
      minWidth: 100,
      flex: 1,
    },
    { field: 'category.name', headerName: 'Categoría', minWidth: 100, flex: 1 },
    { field: 'description', headerName: 'Descripción', minWidth: 250, flex: 2 },
    { field: 'price', headerName: 'Precio', minWidth: 80, flex: 1 },
    { field: 'stock', headerName: 'Stock', minWidth: 80, flex: 1 },
    {
      field: 'status',
      headerName: 'Estado',
      filter: true,
      minWidth: 100,
      flex: 1,
      cellRenderer: (params: any) => {
        return params.value === 'active' ? 'Activo' : 'Inactivo';
      },
    },
    {
      headerName: 'Acciones',
      cellRenderer: ActionsCellRenderer,
      minWidth: 100,
      flex: 1,
    },
  ];
  defaultColDef: ColDef = {
    resizable: false,
  };

  rowHeight = 48;
  paginationPageSizeSelector = [5, 10, 20];
  pagination = true;
  paginationPageSize = 10;
  detailRowAutoHeight = true;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
