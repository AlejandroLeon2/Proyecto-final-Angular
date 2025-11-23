import { inject, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Auth } from '../../../core/service/auth/auth';

import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(Auth);

  name: string | null = null;
  image: string | null = null;
  email: string | null = null;
  user: User | null = null;

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();

    if (this.user) {
      this.name = this.user.displayName;
      this.image = this.user.photoURL;
      this.email = this.user.email;
    }
  }
}
