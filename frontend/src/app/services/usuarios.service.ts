import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario{
  id?: number;
  nombre: string;
  email: string;
  rol: string;
  password?: string; // Solo se usará al crear uno nuevo
  estado?: boolean;
}
// Interfaz para la respuesta estándar de tu API
export interface ApiResponseUsuarios {
  success: boolean;
  data: Usuario[];
}

export interface ApiResponseSingleUsuario {
  success: boolean;
  data: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3500/api/usuarios'; // Ajusta el puerto si tu backend usa otro
  constructor() { }
  

  // Obtener todos los usuarios
  getUsuarios(): Observable<ApiResponseUsuarios> {
    return this.http.get<ApiResponseUsuarios>(this.apiUrl);
  }

  // Obtener un solo usuario por ID (esencial para la ruta de edición posterior)
  getUsuarioById(id: number): Observable<ApiResponseSingleUsuario> {
    return this.http.get<ApiResponseSingleUsuario>(`${this.apiUrl}/${id}`);
  }

  // Crear usuario
  createUsuario(usuario: Usuario): Observable<ApiResponseSingleUsuario> {
    return this.http.post<ApiResponseSingleUsuario>(this.apiUrl, usuario);
  }

  // Actualizar usuario
  updateUsuario(id: number, usuario: Usuario): Observable<ApiResponseSingleUsuario> {
    return this.http.put<ApiResponseSingleUsuario>(`${this.apiUrl}/${id}`, usuario);
  }

  // Eliminar usuario
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
