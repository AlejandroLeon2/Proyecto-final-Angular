import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
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
import { Order } from '../../../../../core/models/order.model';
ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

@Component({
  selector: 'app-orders-table',
  imports: [AgGridAngular],
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.css',
})
export class OrdersTable {
  data = input<Order[]>([]);
  gridTheme = input<string>('ag-theme-quartz');
  isDarkMode = input<boolean>(false);
  quickFilterText = input<string>('');

  private gridApi!: GridApi;
  private router = inject(Router);

  theme = themeQuartz.withParams({
    backgroundColor: '#1f2836',
    headerBackgroundColor: '#1f2836',
  });

  colDefs: ColDef[] = [
    { field: 'id', headerName: 'N° Orden', filter: 'agTextColumnFilter', minWidth: 100 },
    { field: 'user.name', headerName: 'Nombre', filter: 'agTextColumnFilter', minWidth: 100 },
    { field: 'user.email', headerName: 'Correo', filter: 'agTextColumnFilter', minWidth: 100 },
    {
      field: 'items',
      headerName: '# Productos',
      valueGetter: (params) => params.data.items.length,
    },
    { field: 'total', headerName: 'Total', valueGetter: (params) => 'S/. ' + params.data.total },
    {
      field: 'createdAt',
      headerName: 'Fecha',
      valueGetter: (params) => new Date(params.data.createdAt).toLocaleDateString(),
    },
    {
      field: 'direction',
      headerName: 'Dirección',
      valueGetter: (params) =>
        params.data.address.city +
        ', ' +
        params.data.address.street +
        ', ' +
        params.data.address.number,
    },
  ];

  defaultColDef: ColDef = {
    resizable: false,
  };

  rowHeight = 48;
  paginationPageSizeSelector = [5, 10, 20];
  pagination = true;
  paginationPageSize = 10;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onRowClicked(event: any) {
    const orderId = event.data.id;

    if (orderId) {
      this.router.navigate(['/admin/orders', orderId]);
    }
  }
}
