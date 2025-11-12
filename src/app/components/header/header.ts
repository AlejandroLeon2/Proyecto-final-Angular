import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from '../search/search';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [CommonModule, Search, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  menu = false

  showUserMenu = false;
  leaveUserMenu():void{
    setTimeout(()=>{
      this.showUserMenu = false
    },200)
  }

  toggleMenu (){
    this.menu = !this.menu
  }
}
