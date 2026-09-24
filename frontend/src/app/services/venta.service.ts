import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'http://localhost:3000/api/ventas'; 
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getVentas(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  registrarVenta(venta: any): Observable<any> {
    return this.http.post(this.apiUrl, venta, { headers: this.getHeaders() });
  }
}