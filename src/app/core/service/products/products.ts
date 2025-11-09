import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import productsData from '../../../../data/products.json';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  getProducts() {
    //TODO: Implement API call

    //Use observable to return productsData
    return of(productsData);
  }
}
