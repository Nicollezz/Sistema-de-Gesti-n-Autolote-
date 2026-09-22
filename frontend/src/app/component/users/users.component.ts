import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';

interface User {
  [key: string]: unknown;
}

interface UsersResponse {
  data: User[];
}

interface ErrorResponse {
  message?: string;
}

interface HttpError {
  status: number;
  error?: ErrorResponse;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  errorMessage: string = '';
  constructor(@Inject(UserService) private usersService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.errorMessage = '';
    const usersService = this.usersService as UserService & {
      getUsers: () => Observable<UsersResponse>;
    };

    usersService.getUsers().subscribe({
      next: (data: UsersResponse): void => {
        this.users = data.data;
      },
      error: (error: HttpError): void => {
        console.error('Error al obtener usuarios:', error);

        if (error.status === 401) {
          this.errorMessage = error.error?.message || 'Credenciales incorrectas.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Intenta de nuevo.';
        }

      }
    });
  }

}