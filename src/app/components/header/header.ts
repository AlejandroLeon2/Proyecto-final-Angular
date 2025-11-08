import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Seach } from "./seach/seach";

@Component({
  selector: 'app-header',
  imports: [CommonModule, Seach],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  menu = false

  showUserMenu = false;
  leaveUserMenu():void{
    setTimeout(()=>{
      this.showUserMenu = false
    },300)
  }

  toggleMenu (){
    this.menu = !this.menu
  }



}
