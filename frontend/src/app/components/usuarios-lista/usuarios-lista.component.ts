import { Component,inject, OnInit } from '@angular/core';
import { Router,RouterLink, UrlSegment } from '@angular/router';
import { UsuariosService ,Usuario} from '../../services/usuarios.service';


@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './usuarios-lista.component.html',
  styleUrl: './usuarios-lista.component.css'
})
export class UsuariosListaComponent {
  private usuarioService =  inject(UsuariosService);
  private router = inject(Router); 

  listaUsuarios: Usuario[] = [];
  errorMessage: string = '';

  ngOnInit(): void{
    this.cargarUsuario();
  }

  cargarUsuario(): void{
    this.usuarioService.getUsuarios().subscribe({
      next: (res) => {
        this.listaUsuarios = res.data;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.errorMessage = 'No se pudieron cargar los usuarios.';
      }
    });
  }

  irAEditar(id: number | undefined): void{
    if(!id) return;
    this.router.navigate(['/dashboard/usuarios/editar', id]);
  }
  eliminarUsuario(id: number | undefined): void {
    if(!id) return;
    if(confirm("Estas seguro de eliminar este usuario ?"))
    {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          this.cargarUsuario();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
