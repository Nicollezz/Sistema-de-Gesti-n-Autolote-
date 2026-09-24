import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './login.component.html',
  styles: [] 
})
export class LoginComponent {
  username: string = '';
  contrasena: string = ''; 
  errorMessage: string = ''; 

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.errorMessage = ''; 
    
   
    const credentials = { 
      correo: this.username, 
      contrasena: this.contrasena 
    };
    
    this.authService.login(credentials as any).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token || response.data?.token);
        this.router.navigate(['/vehiculos']);
      },
      error: (err: any) => {
        console.error('Error al iniciar sesión:', err);
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }
}