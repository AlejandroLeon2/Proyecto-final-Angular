import { Component } from '@angular/core';
import { RouterModule, RouterOutlet} from '@angular/router';
import { Header } from "../../components/header/header";
import { SidebarUser } from "../../feature/user/Components/sidebar-user/sidebar-user";

@Component({
  selector: 'app-usuario-layout',
  imports: [RouterOutlet, Header, SidebarUser],
  templateUrl: './usuario-layout.html',
  styleUrl: './usuario-layout.css',
})
export class UsuarioLayout {

}
