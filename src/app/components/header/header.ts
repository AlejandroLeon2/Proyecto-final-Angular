import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Seach } from "../seach/seach";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [CommonModule, Seach, RouterLink],
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
