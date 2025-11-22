import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../core/models/product.model';
import { ApiResponse } from '../../core/models/customResponse';
import { LucideAngularModule, TextAlignJustify, Search as search } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [FormsModule, LucideAngularModule, CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {

  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);
  private apiUrl: string = 'http://localhost:3000/v1/products/search';

  TextAlignJustify = TextAlignJustify;
  search = search;

  wordKey:string = '';
  resultados: ApiResponse<Product> = {success:false, message:''};
  crono:number = 0;

  async onSearch() {
    
    //filtramos wordKey con trim y lowerCase dentro de la funcion en wordSearch
    let wordSearch =  this.wordKey.trim().toLowerCase();
    //si el usuario sigue escribiendo limpiamos el cronometro y resultados
    if(this.wordKey.length === 0){
      clearTimeout(this.crono);
      this.resultados = {success:false, message:''};
    }
    this.crono = setTimeout(async()=>{
      try {
        const wordQuery = wordSearch;
        
        const resApi:ApiResponse<Product> = await firstValueFrom(
        // Llamada al endpoint de búsqueda del backend
        this.http.get<ApiResponse<Product>>(this.apiUrl + `/?q=${encodeURIComponent(wordQuery)}`)
        );

        //mientras se espera la respuesta verificamos que wordKey no haya cambiado
        if(wordSearch === this.wordKey.trim().toLowerCase()){

          if(resApi.success){
            this.resultados = resApi;
            console.log(this.resultados);
            
          }else{
            this.resultados = {success:false, message: 'No results found'};
          }
        } 
      }catch (error) {
        console.error('Error en la búsqueda:', error);
      }
    },500);
  };

  onSelectProduct(product: Product) {
  // ejemplo: limpiar búsqueda
  this.wordKey = '';
  this.resultados =  {success:false, message:''};
  
  // navegar a detalle
  this.router.navigate(['/shop', 'product-detail', product.id]);
}

}