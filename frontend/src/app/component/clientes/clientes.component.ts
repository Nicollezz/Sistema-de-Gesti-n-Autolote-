import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  
  nuevoCliente = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: ''
  };

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  guardarCliente(): void {
    if (!this.nuevoCliente.nombre || !this.nuevoCliente.apellido || !this.nuevoCliente.correo) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    this.clienteService.registrarCliente(this.nuevoCliente).subscribe({
      next: (res) => {
        alert('Cliente guardado con éxito.');
        this.cargarClientes(); // Recargar la tabla
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('No se pudo guardar el cliente.');
      }
    });
  }

  limpiarFormulario(): void {
    this.nuevoCliente = {
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      direccion: ''
    };
  }
}