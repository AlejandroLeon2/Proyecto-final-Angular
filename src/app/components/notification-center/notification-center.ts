import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../core/service/notification/notification';
import { LucideAngularModule, X, Check, CircleAlert } from 'lucide-angular';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './notification-center.html',
  styleUrl: './notification-center.css',
})
export class NotificationCenter implements OnInit {
  readonly X = X;
  readonly Check = Check;
  readonly CircleAlert = CircleAlert;
  private notification:NotificationService=inject(NotificationService)
  notifications: any;

  ngOnInit(): void {
    this.notifications = this.notification.notifications;
  }
}
