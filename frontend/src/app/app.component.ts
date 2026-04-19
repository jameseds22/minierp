import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, ReactiveFormsModule],
  template: `
    <div class="shell">
      <div class="toolbar" *ngIf="authService.isAuthenticated()">
        <div>
          <strong>Mini ERP</strong>
          <span class="pill" style="margin-left: 8px;">{{ authService.currentUser()?.role }}</span>
        </div>
        <div style="display:flex; gap:12px; align-items:center;">
          <a routerLink="/">Dashboard</a>
          <a routerLink="/inventario">Inventario</a>
          <a routerLink="/cotizaciones">Cotizaciones</a>
          <button *ngIf="isAdmin()" type="button" class="secondary" style="width:auto;" (click)="openUserModal()">Nuevo usuario</button>
          <button type="button" style="width:auto;" (click)="authService.logout()">Salir</button>
        </div>
      </div>
      <router-outlet></router-outlet>
    </div>

    <div class="modal-backdrop" *ngIf="showUserModal" (click)="closeUserModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>Nuevo usuario</h3>
        <p>Crea usuarios internos con rol de administrador o vendedor.</p>
        <form [formGroup]="userForm" (ngSubmit)="createUser()">
          <input formControlName="username" placeholder="Usuario" [class.field-error]="userInvalid('username')" />
          <p class="field-help" *ngIf="userInvalid('username')">El usuario es obligatorio.</p>

          <input type="password" formControlName="password" placeholder="Contrasena" [class.field-error]="userInvalid('password')" />
          <p class="field-help" *ngIf="userInvalid('password')">La contrasena es obligatoria.</p>

          <select formControlName="role" [class.field-error]="userInvalid('role')">
            <option value="ADMIN">ADMIN</option>
            <option value="VENDEDOR">VENDEDOR</option>
          </select>

          <p class="error" *ngIf="userError">{{ userError }}</p>

          <div class="modal-actions">
            <button type="button" class="secondary" (click)="closeUserModal()">Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AppComponent {
  showUserModal = false;
  userError = '';

  readonly userForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: ['VENDEDOR', Validators.required]
  });

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  isAdmin() {
    return this.authService.currentUser()?.role === 'ADMIN';
  }

  openUserModal() {
    this.userError = '';
    this.userForm.reset({ username: '', password: '', role: 'VENDEDOR' });
    this.userForm.markAsUntouched();
    this.showUserModal = true;
  }

  closeUserModal() {
    this.showUserModal = false;
  }

  createUser() {
    this.userError = '';
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      return;
    }

    this.userService.create({
      username: this.userForm.value.username || '',
      password: this.userForm.value.password || '',
      role: (this.userForm.value.role as 'ADMIN' | 'VENDEDOR') || 'VENDEDOR'
    }).subscribe({
      next: () => {
        this.closeUserModal();
      },
      error: (err) => {
        this.userError = err?.error?.error ?? 'No se pudo crear el usuario';
      }
    });
  }

  userInvalid(controlName: string) {
    const control = this.userForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }
}
