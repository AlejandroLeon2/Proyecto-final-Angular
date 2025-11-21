import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../../service/auth/auth';
import { User } from '@angular/fire/auth';


export const adminGuardGuard: CanActivateFn = async(route, state) => {

  const AuhtService = inject(Auth);
  const router = inject(Router);

  const user: User | null = AuhtService.getCurrentUser();
  if (!user) {
    return router.parseUrl('/login');
  }
  const token = user.uid;

  const rol = await AuhtService.guardUserRol(token);

  if (rol === 'admin') {
    return true;
  }

  // Si no es admin, redirige al home
  return router.parseUrl('/');
};
