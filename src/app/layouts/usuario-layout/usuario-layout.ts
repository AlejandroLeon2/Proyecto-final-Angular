import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-usuario-layout',
  imports: [RouterOutlet, Header],
  templateUrl: './usuario-layout.html',
  styleUrl: './usuario-layout.css',
})
export class UsuarioLayout {}
