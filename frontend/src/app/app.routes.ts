import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { InventarioComponent } from './features/inventario/inventario.component';
import { CotizacionesComponent } from './features/cotizaciones/cotizaciones.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'inventario', component: InventarioComponent },
      { path: 'cotizaciones', component: CotizacionesComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
