import { Component, inject, OnInit } from '@angular/core';
import { Router,RouterLink,ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuariosService, Usuario } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent {
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);// 🟢 Herramienta para leer parámetros de la URL

  usuario: Usuario = {
    nombre: '',
    email: '',
    rol: 'user', 
    password: ''
  }

  isEditMode: boolean = false;
  usuarioId: number | null = null;
  errorMessage: string = '';

  ngOnInit(): void{
    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam){
      this.usuarioId = Number(idParam); // Convertimos el texto a número
      this.isEditMode = true;           // ¡Activamos el modo edición!
      this.cargarDatosUsuario(this.usuarioId); // Buscamos al usuario en SQL Server
    }
  }

  cargarDatosUsuario(id: number): void{
    this.usuariosService.getUsuarioById(id).subscribe({
      next: (res) =>{
        this.usuario = res.data;
        this.usuario.password = ''; 
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'No se pudo obtener la información del usuario.';
      }
    });
  }

    enviarFormulario(): void{
      if(this.isEditMode && this.usuarioId)
      {
        this.usuariosService.updateUsuario(this.usuarioId, this.usuario).subscribe({
          next: (res) => {
            console.log('usuario update.');
            this.router.navigate(['/dashboard/usuarios']);
          },
          error: (err) => console.error(err)
        });
      }else{
        this.usuariosService.createUsuario(this.usuario).subscribe({
          next: (res) => {
            console.log('usuario creado.');
            this.router.navigate(['/dashboard/usuarios']);
          },
          error: (err) => console.error(err)
        });
      }

    }

}
