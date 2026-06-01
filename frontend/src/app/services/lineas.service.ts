import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LineaNegocio{
  id?: number,
  nombre: string;
  descripcion?: string;
  estado?: boolean;
}
// 🟢 NUEVA INTERFAZ: Copia exacta de la estructura que viste en Postman
export interface ApiResponse {
  success: boolean;
  data: LineaNegocio[]; // 👈 Aquí adentro está nuestro arreglo real
}

@Injectable({
  providedIn: 'root'
})
export class LineasService {
  constructor() { }

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3500/api/lineas';

  getLineas(buscar?: string): Observable<ApiResponse>{//ApiResponse
    let url = `${this.apiUrl}`
    if(buscar){
      url+= `?buscar=${buscar}`;
    }
    
    return this.http.get<ApiResponse>(url);//LineaNegocio[], this.apiUrl
  }

  // 🟢 MÉTODO PARA CREAR (POST)
  createLinea(linea: LineaNegocio): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, linea);
  }
  // 🟢 MÉTODO PARA ACTUALIZAR (PUT)
  updateLinea(id: number, linea: LineaNegocio): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, linea);
  }

  // 🟢 MÉTODO PARA ELIMINAR (DELETE)
  deleteLinea(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

}
