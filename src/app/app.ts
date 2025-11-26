import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationCenter } from "./components/notification-center/notification-center";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationCenter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-final-ecommerce');
}
