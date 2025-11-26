import { Injectable, signal, computed } from '@angular/core';
export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationItem {
  message: string;
  type: NotificationType;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class Notification {
  private _notifications = signal<NotificationItem[]>([]);
  readonly notifications = computed(() => this._notifications());

  show(message: string, type: NotificationType = 'info', duration = 3000) {
    const newNotification: NotificationItem = { message, type, duration };
    this._notifications.update(list => [...list, newNotification]);
    setTimeout(() => this.remove(newNotification), duration);
  }

  private remove(notification: NotificationItem) {
    this._notifications.update(list => list.filter(n => n !== notification));
  }

  success(msg: string) { this.show(msg, 'success'); }
  error(msg: string) { this.show(msg, 'error'); }
  info(msg: string) { this.show(msg, 'info'); }
}
