import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service'; // Ajusta la ruta de tu servicio si es necesario

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  
  // Variables para la gestión de selección y consultas
  clienteSeleccionado: any = null;
  consultas: any[] = [];

  // Objeto para el formulario de registro
  nuevoCliente: any = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: ''
  };

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.obtenerClientes();
  }

  // Método para obtener la lista de clientes
  obtenerClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (err: any) => {
        console.error('Error al obtener clientes', err);
      }
    });
  }

  // Método para eliminar cliente
  eliminarCliente(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clienteService.eliminarCliente(id).subscribe({
        next: () => {
          console.log('Cliente eliminado con éxito');
          this.obtenerClientes(); // Recargar la lista
          if (this.clienteSeleccionado && this.clienteSeleccionado.id === id) {
            this.clienteSeleccionado = null; // Limpiar selección si se eliminó
          }
        },
        error: (err: any) => {
          console.error('Error al eliminar cliente', err);
        }
      });
    }
  }

  // Método para ver las consultas del cliente seleccionado
  verConsultas(cliente: any) {
    this.clienteSeleccionado = cliente;
    this.consultas = cliente.consultas || [];
  }

  // Método para registrar un nuevo cliente
  registrarCliente() {
    this.clienteService.crearCliente(this.nuevoCliente).subscribe({
      next: (res) => {
        console.log('Cliente registrado con éxito', res);
        this.obtenerClientes(); // Recargar la lista de clientes
        // Limpiar el formulario después de registrar
        this.nuevoCliente = {
          nombre: '',
          apellido: '',
          correo: '',
          telefono: ''
        };
      },
      error: (err: any) => {
        console.error('Error al registrar cliente', err);
      }
    });
  }
}