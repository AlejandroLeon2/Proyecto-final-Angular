import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../core/models/product.model';
import { ApiResponse } from '../../core/models/customResponse';
import { LucideAngularModule, TextAlignJustify, Search as search } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search',
  imports: [FormsModule, LucideAngularModule, CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {

  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);
  private apiUrl: string = environment.apiURL + '/search/product';

  TextAlignJustify = TextAlignJustify;
  search = search;

  wordKey:string = '';
  resultados: ApiResponse<Product> = {success:false, message:''};
  crono:number = 0;

  onSearchKeyUp() {
    
    //filtramos wordKey con trim y lowerCase dentro de la funcion en wordSearch
    let wordSearch =  this.wordKey.trim().toLowerCase();
    //si el usuario sigue escribiendo limpiamos el cronometro y resultados
    if(wordSearch.length === 0 || wordSearch.trim() === ''){
      clearTimeout(this.crono);
      this.resultados = {success:false, message:''};
      return
    }
    this.crono = setTimeout(async()=>{
      try {
        const wordQuery = wordSearch;
        
        const resApi:ApiResponse<Product> = await firstValueFrom(
        // Llamada al endpoint de búsqueda del backend
        this.http.get<ApiResponse<Product>>(this.apiUrl + `/?data=${encodeURIComponent(wordQuery)}`)
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

  //funcion para guardar wordkey en localstorage y pasar a catalogo-produt
  onViewAllResults(event: Event) {
    event.preventDefault();

    localStorage.setItem('searchWord', this.wordKey.trim().toLowerCase());
    this.clearSearch();

    if(this.router.url === '/shop/catalogo-product'){
      // Si ya estamos en el catálogo de productos, recargamos la página para aplicar el nuevo término de búsqueda
      window.location.reload();
      return;
    }
    this.router.navigate(['/shop', 'catalogo-product']);
  }

  onSelectProduct(product: Product) {
    // limpiar busqueda
    this.clearSearch();
    
    // navegar a detalle
    this.router.navigate(['/shop', 'product-detail', product.id]);
  };

  //funcion para cerrar modal de busqueda y limpiar resultados
  clearSearch(){
    this.wordKey = '';
    this.resultados =  {success:false, message:''};
  };
}