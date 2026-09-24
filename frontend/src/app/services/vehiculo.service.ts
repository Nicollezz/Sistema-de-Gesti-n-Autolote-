import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  obtenerVehiculos() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:3000/api/vehiculos';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getVehiculos(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }


  registrarVehiculo(vehiculo: any): Observable<any> {
    return this.http.post(this.apiUrl, vehiculo, { headers: this.getHeaders() });
  }

  eliminarVehiculo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}