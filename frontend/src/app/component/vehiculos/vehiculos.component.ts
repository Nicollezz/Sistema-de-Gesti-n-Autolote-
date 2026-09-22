import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

interface Vehiculo {
  [key: string]: unknown;
}

interface VehiculosResponse {
  results: Vehiculo[];
}

interface VehiculosError {
  status: number;
  error?: {
    message?: string;
  };
}

@Component({
  selector: 'app-vehiculos',
  imports: [CommonModule],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss'
})
export class VehiculosComponent implements OnInit{
  vehiculos: Vehiculo[] = [];
  errorMessage: string = '';
  constructor(private usersService: UserService) {}
  ngOnInit() {
    this.loadVehiculos();
  }

  loadVehiculos(){
    this.errorMessage = '';
    (this.usersService as any).getVehiculos().subscribe({
      next: (data: VehiculosResponse) => {
        this.vehiculos = data.results;
      },
      error: (error: VehiculosError) => {
        console.error('Error al obtener usuarios:', error);

        if (error.status === 401) {
          this.errorMessage = error.error?.message || 'Credenciales incorrectas.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Intenta de nuevo.';
        }

      }
    });
  }
}