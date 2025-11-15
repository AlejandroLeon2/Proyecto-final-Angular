import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Auth } from '../../service/auth/auth';

export const userGuardGuard: CanActivateFn = async (route, state) => {
  const AuhtService = inject(Auth);
  const router = inject(Router);

  const user: User | null = AuhtService.getCurrentUser();
  if (!user) {
    return router.parseUrl('/login');
  }
  const token = user.uid;

  const rol = await AuhtService.getUserRol(token);

  if (rol === 'usuario') {
    return true;
  }

  return router.parseUrl('/user');
};
