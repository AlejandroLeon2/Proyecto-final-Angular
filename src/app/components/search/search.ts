import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../core/models/product';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private http: HttpClient = inject(HttpClient);
  private apiUrl: string = 'http://localhost:3000/v1/products/search';

  wordKey:string = '';
  resultados: {} = {}
  crono:number = 0;

  async onSearch() {
    interface ApiResponse<T> {
      success: boolean;
      message: string;
      data: T;
    }

    //filtramos wordKey con trim y lowerCase dentro de la funcion en wordSearch
    let wordSearch =  this.wordKey.trim().toLowerCase();
    //si el usuario sigue escribiendo limpiamos el cronometro y resultados
    if(this.wordKey.length === 0){
      clearTimeout(this.crono);
      this.resultados = {};
    }
    this.crono = setTimeout(async()=>{
      try {
        const wordQuery = wordSearch
        const resApi:any = await firstValueFrom(
        // Llamada al endpoint de búsqueda del backend
        this.http.get<ApiResponse<Product>>(this.apiUrl + `/?q=${encodeURIComponent(wordQuery)}`)
      );
      //mientras se espera la respuesta verificamos que wordKey no haya cambiado
      if(wordSearch === this.wordKey.trim().toLowerCase()){
        console.log(resApi);
        
          if(resApi.data.products.length == 0){
            this.resultados = {message: 'No se encontraron productos'};
            console.log(`sin datos a mostrar`);
          } else {
            this.resultados = resApi;
            console.log(`sin datos a mostrar`);
          }
        } 
      }catch (error) {
        console.error('Error en la búsqueda:', error);
      }
    },300);
  }
}