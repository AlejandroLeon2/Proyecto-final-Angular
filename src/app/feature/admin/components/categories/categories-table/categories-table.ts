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
import { Category } from '../../../../../core/models/category.model';
import { ActionsCellRenderer } from './actions-cell-renderer';
ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

@Component({
  selector: 'app-categories-table',
  imports: [AgGridAngular, FormsModule],
  templateUrl: './categories-table.html',
  styleUrl: './categories-table.css',
  encapsulation: ViewEncapsulation.None,
})
export class CategoriesTable {
  categories = input<Category[]>([]);
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
      field: 'name',
      headerName: 'Nombre',
      minWidth: 100,
      flex: 1,
    },
    { field: 'description', headerName: 'Descripción', minWidth: 150, flex: 2 },
    {
      field: 'status',
      headerName: 'Estado',
      filter: true,
      cellRenderer: (params: any) => {
        return params.value === 'active' ? 'Activo' : 'Inactivo';
      },
    },
    {
      headerName: 'Acciones',
      cellRenderer: ActionsCellRenderer,
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
