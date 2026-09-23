import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DivisaService {
  // Puedes usar una API pública gratuita de tasas de cambio
  private apiUrl = 'https://open.er-api.com/v6/latest/USD';

  constructor(private http: HttpClient) {}

  obtenerTasas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}