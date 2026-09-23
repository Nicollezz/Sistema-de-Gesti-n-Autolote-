import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculoService } from '../../services/vehiculo.service';
import { DivisaService } from '../../services/divisa.service'; 

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculos.component.html',
  styles: [`
    /* Estilos integrados para evitar errores si no existe el archivo .css */
  `]
})
export class VehiculosComponent implements OnInit {
  vehiculos: any[] = [];
  cargando: boolean = false;
  errorMensaje: string = '';
  tasaCambio: number = 24.75; 
  monedaSeleccionada: string = 'USD';

  // Objeto para el formulario de nuevo vehículo
  nuevoVehiculo: any = {
    marca: '',
    modelo: '',
    anio: null,
    precio: null,
    estado_disponibilidad: '',
    imagen_url: ''
  };

  constructor(
    private vehiculoService: VehiculoService,
    private divisaService: DivisaService
  ) {}

  ngOnInit(): void {
    this.cargarVehiculos();
    this.cargarTasasCambio();
  }

  cargarVehiculos(): void {
    this.cargando = true;
    this.vehiculoService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar vehículos', err);
        this.errorMensaje = 'No se pudieron cargar los vehículos.';
        this.cargando = false;
      }
    });
  }

  cargarTasasCambio(): void {
    this.divisaService.obtenerTasas().subscribe({
      next: (data: any) => {
        if (data && data.rates && data.rates.HNL) {
          this.tasaCambio = data.rates.HNL;
        } else if (data && data.data && data.data.rates && data.data.rates.HNL) {
          this.tasaCambio = data.data.rates.HNL;
        }
      },
      error: (err) => console.warn('Usando tasa por defecto debido a error en API:', err)
    });
  }

  guardarVehiculo(): void {
    if (!this.nuevoVehiculo.marca || !this.nuevoVehiculo.modelo) {
      this.errorMensaje = 'Por favor complete los campos obligatorios.';
      return;
    }

    this.vehiculoService.crearVehiculo(this.nuevoVehiculo).subscribe({
      next: () => {
        this.errorMensaje = '';
        this.nuevoVehiculo = { marca: '', modelo: '', anio: null, precio: null, estado_disponibilidad: '', imagen_url: '' };
        this.cargarVehiculos();
      },
      error: (err) => {
        console.error('Error al guardar vehículo', err);
        this.errorMensaje = 'Error al registrar el vehículo.';
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Está seguro de eliminar este vehículo?')) {
      this.vehiculoService.eliminarVehiculo(id).subscribe({
        next: () => {
          this.cargarVehiculos();
        },
        error: (err) => {
          console.error('Error al eliminar vehículo', err);
          this.errorMensaje = 'No se pudo eliminar el vehículo.';
        }
      });
    }
  }

  calcularPrecio(precioDolares: number): number {
    if (this.monedaSeleccionada === 'HNL') {
      return precioDolares * this.tasaCambio;
    }
    return precioDolares;
  }
}