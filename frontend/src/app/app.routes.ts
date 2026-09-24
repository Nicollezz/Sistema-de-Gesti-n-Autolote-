import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { VehiculosComponent } from './component/vehiculos/vehiculos.component';
import { ClientesComponent } from './component/clientes/clientes.component';
import { VentasComponent } from './component/ventas/ventas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'vehiculos', component: VehiculosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'ventas', component: VentasComponent },
  { path: '**', redirectTo: 'login' }
];