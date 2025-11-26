import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  success(message: string) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#9e713ebd',
      style: {
        borderRadius: '10px',
        padding: '10px 16px',
      },
    }).showToast();
  }

  error(message: string) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#f44336',
    }).showToast();
  }

  info(message: string) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#2196F3',
    }).showToast();
  }
}
