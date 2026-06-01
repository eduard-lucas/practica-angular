import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// 1. Importamos la interfaz
import { LoginCredentials } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyección moderna de dependencias en Angular 17
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3500/api/auth';

  constructor() { }
  /**
   * Envía el correo y clave a Node.js
   */
  //{ email: string; password: string }
  login(credenciales: LoginCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credenciales).pipe(
      tap(res => {
        // Si el backend nos devuelve el token, lo guardamos en el navegador
        if (res && res.token) {
          localStorage.setItem('token_vimatica', res.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token_vimatica');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token_vimatica');
  }
}