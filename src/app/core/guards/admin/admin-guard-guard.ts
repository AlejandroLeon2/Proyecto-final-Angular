import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth as authservice} from '../../service/auth';


export const adminGuardGuard: CanActivateFn = async(route, state) => {

  const Auth = inject(authservice);
  const router = inject(Router);

  //obtenermos token de ususario
  const token:string|null = Auth.getCookie(`token`);

  if(token === null){
    return false
  }

  //obtenemos rol de usuario de api
  const rolResponce:string = await Auth.guardUserRol(token);

  if(rolResponce === 'admin'){
    return true
  }
  
  router.navigate(['/'])
  return false;
};
