import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-external-products',
  imports: [CommonModule],
  templateUrl: './external-products.component.html',
  styleUrl: './external-products.component.scss'
})
export class ExternalProductsComponent implements OnInit {
  products: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getExternalProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = error.error?.message || 'No autorizado para consumir este recurso.';
        } else {
          this.errorMessage = error.error?.message || 'No fue posible cargar los productos externos.';
        }

        this.isLoading = false;
      }
    });
  }
}