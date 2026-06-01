/*
Pega este código (este archivo se encarga de "espiar" las peticiones y ponerles automáticamente 
tu Token JWT en las cabeceras):
 */
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Inyectamos el identificador de la plataforma
  const platformId = inject(PLATFORM_ID);
  
  // 2. Verificamos si el código se está ejecutando en el navegador del usuario
  if (isPlatformBrowser(platformId)) {
    // Buscamos si hay un token guardado en el navegador
    const token = localStorage.getItem('token_vimatica');

    // Si el token existe, clonamos la petición original y le inyectamos la cabecera Authorization
    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedReq); // Envía la petición blindada con el token
    }

  }

  // Si no hay token (como en el Login), la petición pasa limpia
  return next(req);
};