import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
// Nota: Importa aquí tu componente de Dashboard o el que uses de pantalla principal
//import { DashboardComponent } from './components/dashboard/dashboard.component'; 
import { authGuard } from './guards/auth.guard'; // 🟢 Importamos el Guard

// 💡 Componentes que simulan tus vistas (debes crearlos o usar los que ya tienes)
import { LineasVisorComponent } from './components/lineas-visor/lineas-visor.component'; 
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { InicioResumenComponent } from './components/inicio-resumen/inicio-resumen.component';
import { LineasGestionComponent } from './components/lineas-gestion/lineas-gestion.component';

// 🟢 NUEVAS IMPORTACIONES
import { UsuariosListaComponent } from './components/usuarios-lista/usuarios-lista.component';
import { UsuarioFormComponent } from './components/usuario-form/usuario-form.component';


export const routes: Routes = [
  // ==========================================
  // 🔓 RUTAS PÚBLICAS (Cualquiera puede entrar)
  // ==========================================
  { path: 'login', component: LoginComponent  },
  {  path: 'lineas-publicas', 
    component: LineasVisorComponent // 👈 Tu visor de información visual que no pide token
  },

  // ==========================================
  // 🔒 RUTAS PRIVADAS (Solo para logueados)
  // ==========================================
  {
    path: 'dashboard',
    component: DashboardLayoutComponent, // 👈 El "cascarón" que tiene el Sidebar y el Navbar
    canActivate: [authGuard],            // 🛡️ El Guardián protege a todo este bloque y sus hijos
    children: [
      { 
        path: '', 
        component: InicioResumenComponent // 📊 Vista por defecto al entrar a /dashboard (Gráficos, bienvenida)
      },
      { 
        path: 'lineas-negocio', 
        component: LineasGestionComponent // 🛠️ El CRUD privado para Crear, Editar y Borrar líneas
        // URL completa: http://localhost:4200/dashboard/lineas-negocio
      },
      // 🟢 NUEVAS RUTAS PARA EL CRUD DE USUARIOS
      { path: 'usuarios', component: UsuariosListaComponent },
      { path: 'usuarios/nuevo', component: UsuarioFormComponent },
      { path: 'usuarios/editar/:id', component: UsuarioFormComponent} // 👈 :id es un parámetro dinámico
    ]
  },

  // ==========================================
  // 🔄 REDIRECCIONES DE CONTROL
  // ==========================================
  // Si el usuario entra a la raíz "http://localhost:4200/", lo mandamos al visor público
  //{ path: '', redirectTo: 'lineas-publicas', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Si escribe cualquier ruta que no existe, lo mandamos al login para seguridad
  { path: '**', redirectTo: 'login' }

];
