import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <div class="card" style="max-width:420px; margin:80px auto;">
      <h1>Acceso al ERP</h1>
      <p>Ingresa con tu usuario para gestionar stock y cotizaciones.</p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="grid">
        <input formControlName="username" placeholder="Usuario" />
        <input formControlName="password" type="password" placeholder="Contraseña" />
        <button type="submit" [disabled]="form.invalid || loading">Iniciar sesión</button>
      </form>

      <p class="error" *ngIf="error">{{ error }}</p>
      <p><strong>Demo:</strong> admin / Admin123*</p>
    </div>
  `
})
export class LoginComponent {
  loading = false;
  error = '';

  readonly form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.authService.login(this.form.getRawValue() as { username: string; password: string }).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.loading = false;
        this.error = 'No se pudo iniciar sesión';
      }
    });
  }
}
