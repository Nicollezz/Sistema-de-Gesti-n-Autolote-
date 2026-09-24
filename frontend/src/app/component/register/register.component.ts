import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre: string = '';
  correo: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

onRegister() {
    const userData = {
      nombre: this.nombre,
      correo: this.correo,
      contrasena: this.password  
    };

    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(userData as any).subscribe({
      next: (response: any) => {
        this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        this.errorMessage = error.error?.message || 'Ocurrió un error al registrarse.';
      }
    });
  }
}