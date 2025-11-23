import { inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../service/auth/auth';

export const adminGuard: CanActivateFn = async (route, state) => {
  const AuhtService = inject(Auth);
  const router = inject(Router);

  const role = AuhtService.role();
  if (role === 'unknown') {
    return router.parseUrl('/shop/home');
  }

  if (role === 'admin') {
    return true;
  }

  // Si no es admin, redirige al home
  return router.parseUrl('/');
};
