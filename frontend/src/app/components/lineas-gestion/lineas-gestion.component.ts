import { Component, inject } from '@angular/core';
import { LineaNegocio, LineasService } from '../../services/lineas.service';
import { Subject, Subscription } from 'rxjs';//para-buscar-p2
import { debounceTime,distinctUntilChanged } from 'rxjs';//'rxjs/operators';
// 🟢 IMPORTANTE: Importamos FormsModule para el manejo de inputs ([(ngModel)])
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lineas-gestion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './lineas-gestion.component.html',
  styleUrl: './lineas-gestion.component.css'
})

export class LineasGestionComponent {
  private lineaService = inject(LineasService);
  listaLineas: LineaNegocio[] = [];
  errorMessage: string = '';
  txtBuscar: string = ''; //para-buscar-p2

  // 🎯 El truco: Un Subject es un "emisor" reactivo
  private buscador$ = new Subject<string>();//para-buscar-p2
  private subBuscador!: Subscription;//para-buscar-p2
  
  // 🟢 VARIABLES PARA EL MODAL Y EDICIÓN
  isModalOpen: boolean = false;
  lineaSeleccionada: LineaNegocio = { nombre: '', descripcion: '' };
  // 🟢 NUEVAS VARIABLES PARA EL MODAL DE CREACIÓN
  isCreateModalOpen: boolean = false;
  nuevaLinea: LineaNegocio = { nombre: '', descripcion: '' };

  ngOnInit(): void{
    this.cargarLineas();
    //para-buscar-p2
    this.subBuscador = this.buscador$.pipe(
      debounceTime(350),           // ⏱️ Espera 350ms a que el usuario deje de teclear
      distinctUntilChanged()       // 🚫 Evita disparar la petición si el texto es idéntico al anterior
    ).subscribe(termino => {
      this.cargarLineas(termino);  // Refresca la tabla automáticamente con el filtro
    });
  }

  cargarLineas(termino?: string): void{ //"termino?: string", nuevo para busca
    console.log("termino",termino);
    this.lineaService.getLineas(termino).subscribe({
      next: (res) => {
        console.log(res);
        this.listaLineas = res.data;
      },
      error: (err) => {
        console.error('Error al traer las líneas de negocio:', err);
        this.errorMessage = 'No se pudieron cargar los datos. Verifica la conexión.';
      }
    });
  }
  // ⚡ Este método se ejecuta cada vez que el usuario presiona una tecla
  onBuscar(texto: string): void {
    this.buscador$.next(texto); // Mandamos el texto al flujo reactivo
  }

  ngOnDestroy(): void {
    // 🧹 Buena práctica indispensable: Romper la suscripción al salir del componente
    if (this.subBuscador) this.subBuscador.unsubscribe();
  }



  abrirModalCrear(): void {
    this.nuevaLinea = { nombre: '', descripcion: '' }; 
    this.isCreateModalOpen = true;
  }
  cerrarModalCrear(): void {
    this.isCreateModalOpen = false;
  }
  ejecutarCreacion(): void {
    if (!this.nuevaLinea.nombre.trim()) return;

    this.lineaService.createLinea(this.nuevaLinea).subscribe({
      next: (res) => {
        console.log('¡Nueva línea creada!', res);
        this.cerrarModalCrear();
        this.cargarLineas(); // Recarga la tabla con el nuevo registro incluido 🔄
      },
      error: (err) => {
        console.error('Error al crear:', err);
        alert('Hubo un error al guardar la nueva línea de negocio.');
      }
    });
  }


  // 🟢 ABRIR MODAL CON LOS DATOS DE LA FILA SELECCIONADA
  abrirModalEditar(linea: LineaNegocio): void {
    // Usamos el operador spread {...} para hacer una copia limpia y que no altere la tabla antes de guardar
    this.lineaSeleccionada = { ...linea }; 
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }

  // =========================================================================
  // LÓGICA PARA EDITAR Y ELIMINAR (Se mantienen intactos)
  // =========================================================================
  // 🟢 EJECUTAR ACTUALIZACIÓN (PUT)
  guardarCambios(): void {
    if (!this.lineaSeleccionada.id) return;

    this.lineaService.updateLinea(this.lineaSeleccionada.id, this.lineaSeleccionada).subscribe({
      next: (res) => {
        console.log('Actualizado con éxito:', res);
        this.cerrarModal();
        this.cargarLineas(); // Recargamos la tabla en vivo 🔄
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert('Hubo un error al actualizar la línea de negocio.');
      }
    });
  }

  // 🟢 EJECUTAR ELIMINACIÓN (DELETE)
  eliminarLinea(id: number | undefined): void {
    if (!id) return;

    // Un confirm sencillo nativo del navegador para seguridad
    if (confirm('¿Estás seguro de que deseas eliminar esta línea de negocio?')) {
      this.lineaService.deleteLinea(id).subscribe({
        next: (res) => {
          console.log('Eliminado con éxito:', res);
          this.cargarLineas(); // Recargamos la tabla en vivo 🔄
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Hubo un error al intentar eliminar el registro.');
        }
      });
    }
  }


}
