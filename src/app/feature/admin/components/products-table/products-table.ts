import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AsyncPipe } from '@angular/common';
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
import { ProductsService } from '../../../../core/service/products/products';

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

@Component({
  selector: 'app-products-table',
  imports: [AgGridAngular, FormsModule, AsyncPipe],
  templateUrl: './products-table.html',
  styleUrl: './products-table.css',
  encapsulation: ViewEncapsulation.None,
})
export class ProductsTable {
  @Input() gridTheme: string = 'ag-theme-quartz';
  @Input() isDarkMode: boolean = false;
  @Input() quickFilterText: string = '';

  //Inject products service
  productsService: ProductsService = inject(ProductsService);

  private gridApi!: GridApi;
  theme = themeQuartz;

  rowData$ = this.productsService.getProducts();
  columnDefs = [
    {
      field: 'name',
      headerName: 'Nombre',
      minWidth: 180,
    },
    { field: 'category', headerName: 'Categoría', minWidth: 150 },
    { field: 'description', headerName: 'Descripción', minWidth: 200 },
    { field: 'price', headerName: 'Precio' },
    { field: 'stock', headerName: 'Stock' },
    {
      field: 'status',
      headerName: 'Estado',
      filter: true,
      filterParams: { active: 'Activo', inactive: 'Inactivo' },
    },
    { headerName: 'Acciones' },
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
