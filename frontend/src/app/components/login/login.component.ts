import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';// 👈 Crucial para usar [(ngModel)] en el HTML
import { AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';
// 🟢 PASO 1: Importamos la interfaz desde su carpeta
import { LoginCredentials } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],  // 👈 Importamos las herramientas aquí directamente
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);// 🟢 2. Inyectamos el enrutador

  // Variables que se amarrarán al HTML
  /* V1
  email = '';
  password = '';
  */
  credenciales: LoginCredentials = {
    email: '',
    password: ''
  };
  errorMessage = '';

  onLogin(): void {
    //const datos = { email: this.email, password: this.password };

    this.authService.login(this.credenciales).subscribe({
      next: (res) => {
        console.log('¡Login exitoso, token guardado en el navegador!', res);
        // Cuando configuremos las rutas, aquí redirigiremos a las líneas de negocio:
        // this.router.navigate(['/lineas']);
        this.errorMessage = '';// Aquí redirigirás al usuario a la página de inicio/dashboard más adelante
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Si las credenciales están mal, capturamos el mensaje de error del backend
        this.errorMessage = err.error?.message || 'Error al conectar con el servidor.';
      }
    });
  }
}
