import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationService } from '../../core/service/notification/notification';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-center.html',
  styleUrl: './notification-center.css',
})
export class NotificationCenter {
  notifications: any;

  constructor(private notification: NotificationService) {
    // Se inicializa después de la inyección
    this.notifications = this.notification.notifications;
  }
}
