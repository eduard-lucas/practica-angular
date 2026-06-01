// src/app/guards/auth.guard.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Verificamos si estamos en el navegador para poder leer el localStorage
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token_vimatica');

    if (token) {
      return true; // 🔓 ¡Tiene token! Se le permite el acceso a la pantalla
    }
  }

  // 🔒 No hay token: Lo redirigimos al Login y bloqueamos la ruta actual
  router.navigate(['/login']);
  return false;
};