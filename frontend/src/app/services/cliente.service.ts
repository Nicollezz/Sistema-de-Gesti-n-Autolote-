import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000/api/clientes';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getClientes(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  crearCliente(cliente: any): Observable<any> {
    return this.http.post(this.apiUrl, cliente, this.getHeaders());
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  getConsultasCliente(clienteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${clienteId}/consultas`, this.getHeaders());
  }

  registrarConsulta(clienteId: number, mensaje: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${clienteId}/consultas`, { mensaje }, this.getHeaders());
  }
}