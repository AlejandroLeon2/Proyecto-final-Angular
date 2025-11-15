import { Component, input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ColDef,
  GetDetailRowDataParams,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  SizeColumnsToContentStrategy,
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
      minWidth: 180,
    },
    { field: 'description', headerName: 'Descripción', minWidth: 200 },
    {
      field: 'status',
      headerName: 'Estado',
      filter: true,
      filterParams: { active: 'Activo', inactive: 'Inactivo' },
    },
    {
      headerName: 'Acciones',
      cellRenderer: ActionsCellRenderer,
    },
  ];
  defaultColDef: ColDef = {
    resizable: false,
  };
  autoSizeStrategy: SizeColumnsToContentStrategy = {
    type: 'fitCellContents',
  };
  detailCellRendererParams = {
    detailGridOptions: {
      columnDefs: [
        { field: 'title', flex: 1.5 },
        { field: 'available', maxWidth: 120 },
        { field: 'format', flex: 2 },
        { field: 'label', flex: 1 },
        { field: 'country', flex: 0.66 },
        {
          field: 'cat',
          headerName: 'Cat#',
          type: 'rightAligned',
          flex: 0.66,
        },
        { field: 'year', type: 'rightAligned', maxWidth: 80 },
      ],
      headerHeight: 38,
    },
    getDetailRowData: ({ successCallback, data: { variantDetails } }: GetDetailRowDataParams) =>
      successCallback(variantDetails),
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
