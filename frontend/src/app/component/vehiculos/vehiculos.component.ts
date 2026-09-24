import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculoService } from '../../services/vehiculo.service';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {
  vehiculos: any[] = [];
  cargando: boolean = false;
  errorMensaje: string = '';
  monedaSeleccionada: string = 'HNL'; // <-- Variable añadida para el control de divisas

  nuevoVehiculo = {
    marca: '',
    modelo: '',
    anio: '',
    precio: '',
    estado_disponibilidad: '',
    imagen_url: ''
  };

  constructor(private vehiculoService: VehiculoService) {}

  ngOnInit(): void {
    this.obtenerVehiculos();
  }

  obtenerVehiculos() {
    this.cargando = true;
    this.errorMensaje = '';
    this.vehiculoService.getVehiculos().subscribe({
      next: (data: any) => {
        this.vehiculos = data;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar vehículos:', err);
        this.errorMensaje = 'No se pudieron cargar los vehículos.';
        this.cargando = false;
      }
    });
  }

  guardarVehiculo() {
    this.errorMensaje = '';
    this.vehiculoService.registrarVehiculo(this.nuevoVehiculo).subscribe({
      next: (res: any) => {
        console.log('Vehículo guardado', res);
        this.obtenerVehiculos();
        this.nuevoVehiculo = {
          marca: '',
          modelo: '',
          anio: '',
          precio: '',
          estado_disponibilidad: '',
          imagen_url: ''
        };
      },
      error: (err: any) => {
        console.error('Error al registrar:', err);
        this.errorMensaje = 'Error al registrar el vehículo.';
      }
    });
  }

  eliminar(id: number) {
    this.vehiculoService.eliminarVehiculo(id).subscribe({
      next: () => {
        this.obtenerVehiculos();
      },
      error: (err: any) => {
        console.error('Error al eliminar:', err);
        this.errorMensaje = 'No se pudo eliminar el vehículo.';
      }
    });
  }
}