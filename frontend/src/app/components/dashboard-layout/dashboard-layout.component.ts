import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// 🟢 IMPORTANTE: Importamos RouterOutlet y RouterLink para la navegación interna
import { Router,RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {
  // Inyectamos el servicio de auth y el Router de Angular
  private authService = inject(AuthService);
  private router = inject(Router);

    ejecutarDeslogueo(): void {
    // 1. Borramos el token llamando al servicio
    this.authService.logout();
    // 2. Redirigimos al Login trucando el historial del navegador
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
