import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { VehiculoService } from '../../services/vehiculo.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  ventas: any[] = [];
  clientes: any[] = [];
  vehiculos: any[] = [];
  
  successMessage: string = '';
  errorMessage: string = '';

  nuevaVenta = {
    cliente_id: '',
    vehiculo_id: '',
    subtotal: 0,
    impuesto: 0,
    total: 0
  };

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private vehiculoService: VehiculoService
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarClientes();
    this.cargarVehiculos();
  }

  cargarVentas(): void {
    this.ventaService.getVentas().subscribe({
      next: (data: any) => this.ventas = data,
      error: (err: any) => console.error('Error al cargar ventas', err)
    });
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data: any) => this.clientes = data,
      error: (err: any) => console.error('Error al cargar clientes', err)
    });
  }

  cargarVehiculos(): void {
    this.vehiculoService.getVehiculos().subscribe({
      next: (data: any) => this.vehiculos = data,
      error: (err: any) => console.error('Error al cargar vehículos', err)
    });
  }

  
  onVehiculoChange(): void {
    const vehiculoSeleccionado = this.vehiculos.find(v => v.id == this.nuevaVenta.vehiculo_id);
    
    if (vehiculoSeleccionado) {
      const precioBase = Number(vehiculoSeleccionado.precio) || 0;
      this.nuevaVenta.subtotal = precioBase;
      this.calcularTotales();
    } else {
      this.nuevaVenta.subtotal = 0;
      this.calcularTotales();
    }
  }

  calcularTotales(): void {
    const subtotalNum = Number(this.nuevaVenta.subtotal) || 0;
    this.nuevaVenta.impuesto = Number((subtotalNum * 0.15).toFixed(2));
    this.nuevaVenta.total = Number((subtotalNum + this.nuevaVenta.impuesto).toFixed(2));
  }

  guardarVenta(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.nuevaVenta.cliente_id || !this.nuevaVenta.vehiculo_id || this.nuevaVenta.subtotal <= 0) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios de la venta.';
      return;
    }

    this.ventaService.registrarVenta(this.nuevaVenta).subscribe({
      next: () => {
        this.successMessage = '¡Venta registrada con éxito!';
        this.cargarVentas();
        this.nuevaVenta = { cliente_id: '', vehiculo_id: '', subtotal: 0, impuesto: 0, total: 0 };
      },
      error: (err: any) => {
        console.error('Error al registrar venta', err);
        this.errorMessage = 'No se pudo registrar la venta. Verifique los datos.';
      }
    });
  }
}