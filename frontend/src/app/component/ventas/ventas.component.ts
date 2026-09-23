import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styles: [`
    
  `]
})
export class VentasComponent implements OnInit {  // <-- Sin la palabra 'public' antes de 'class'
  ventas: any[] = [];
  clientes: any[] = [];
  
  nuevaVenta = {
    cliente_id: '',
    vehiculo_id: '',
    subtotal: 0,
    impuesto: 0,
    total: 0
  };

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarClientes();
  }

  cargarVentas(): void {
    this.ventaService.getVentas().subscribe({
      next: (data) => this.ventas = data,
      error: (err) => console.error('Error al cargar ventas', err)
    });
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientes = data,
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  calcularTotales(): void {
    this.nuevaVenta.impuesto = this.nuevaVenta.subtotal * 0.15;
    this.nuevaVenta.total = Number(this.nuevaVenta.subtotal) + Number(this.nuevaVenta.impuesto);
  }

  guardarVenta(): void {
    this.ventaService.registrarVenta(this.nuevaVenta).subscribe({
      next: () => {
        alert('Venta registrada con éxito');
        this.cargarVentas();
        this.nuevaVenta = { cliente_id: '', vehiculo_id: '', subtotal: 0, impuesto: 0, total: 0 };
      },
      error: (err) => console.error('Error al registrar venta', err)
    });
  }
}