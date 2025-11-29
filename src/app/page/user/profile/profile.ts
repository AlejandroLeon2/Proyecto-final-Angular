import { inject, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Auth } from '../../../core/service/auth/auth';
import { LucideAngularModule, Mail, Phone, MapPin, Calendar, Edit2, Share2 } from 'lucide-angular';

import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [LucideAngularModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(Auth);
  readonly MailIcon = Mail;
  readonly PhoneIcon = Phone;
  readonly MapPinIcon = MapPin;
  readonly CalendarIcon = Calendar;

  ngOnInit(): void {}
  get user() {
    return this.authService.user();
  }
}
