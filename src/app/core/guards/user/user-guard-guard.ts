import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth as authservice} from '../../service/auth';


export const userGuardGuard: CanActivateFn = async(route, state) => {

  const Auth = inject(authservice);
  const router = inject(Router);

  //obtenermos token de ususario
  const token:string|null = Auth.getCookie(`token`);

  if(token === null){
    return false
  }

  const rolResponce:string = await Auth.tryUserRol(`usuario`,token);

  if(rolResponce === 'usuario'){
    return true
  }

  router.navigate(['/'])
  return false;
};
