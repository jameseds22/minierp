import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, interval, startWith, switchMap, takeUntil } from 'rxjs';
import { InventoryItem } from '../../shared/models/inventory.model';
import { Product, Warehouse } from '../../shared/models/master-data.model';
import { InventoryService } from '../../core/services/inventory.service';
import { MasterDataService } from '../../core/services/master-data.service';

@Component({
  standalone: true,
  selector: 'app-inventario',
  imports: [NgFor, NgIf, ReactiveFormsModule],
  template: `
    <div class="grid grid-2">
      <section class="card masked-card">
        <div class="top-actions">
          <button type="button" class="secondary" (click)="openProductModal()">Nuevo producto</button>
        </div>
        <h2>Movimiento de inventario</h2>
        <form [formGroup]="form" (ngSubmit)="save()" class="grid">
          <select formControlName="productoId" [class.field-error]="isInvalid('productoId')">
            <option value="">Producto</option>
            <option *ngFor="let product of products" [value]="product.id">{{ product.nombre }}</option>
          </select>
          <p class="field-help" *ngIf="isInvalid('productoId')">Selecciona un producto.</p>

          <select formControlName="almacenId" [class.field-error]="isInvalid('almacenId')">
            <option value="">Almacen</option>
            <option *ngFor="let warehouse of warehouses" [value]="warehouse.id">{{ warehouse.nombre }}</option>
          </select>
          <p class="field-help" *ngIf="isInvalid('almacenId')">Selecciona un almacen.</p>

          <select formControlName="tipo" [class.field-error]="isInvalid('tipo')">
            <option value="ENTRADA">ENTRADA</option>
            <option value="SALIDA">SALIDA</option>
          </select>

          <input type="number" formControlName="cantidad" placeholder="Cantidad" [class.field-error]="isInvalid('cantidad')" />
          <p class="field-help" *ngIf="isInvalid('cantidad')">Ingresa una cantidad valida.</p>

          <input formControlName="motivo" placeholder="Motivo" [class.field-error]="isInvalid('motivo')" />
          <p class="field-help" *ngIf="isInvalid('motivo')">El motivo es obligatorio.</p>

          <button type="submit">Registrar</button>
        </form>
        <p class="error" *ngIf="error">{{ error }}</p>
      </section>

      <section class="card masked-card">
        <h2>Stock por almacen</h2>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Almacen</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of inventory">
              <td>{{ item.sku }}</td>
              <td>{{ item.producto }}</td>
              <td>{{ item.almacen }}</td>
              <td>{{ item.stock }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <div class="modal-backdrop" *ngIf="showProductModal" (click)="closeProductModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>Nuevo producto</h3>
        <p>Ingresa el nombre y el costo del producto para darlo de alta rapidamente.</p>
        <form [formGroup]="productModalForm" (ngSubmit)="createQuickProduct()">
          <input formControlName="nombre" placeholder="Nombre del producto" [class.field-error]="modalInvalid(productModalForm, 'nombre')" />
          <p class="field-help" *ngIf="modalInvalid(productModalForm, 'nombre')">El nombre es obligatorio.</p>

          <input type="number" step="0.01" formControlName="costo" placeholder="Costo" [class.field-error]="modalInvalid(productModalForm, 'costo')" />
          <p class="field-help" *ngIf="modalInvalid(productModalForm, 'costo')">Ingresa un costo valido.</p>

          <div class="modal-actions">
            <button type="button" class="secondary" (click)="closeProductModal()">Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class InventarioComponent implements OnInit, OnDestroy {
  inventory: InventoryItem[] = [];
  products: Product[] = [];
  warehouses: Warehouse[] = [];
  error = '';
  showProductModal = false;
  private readonly destroy$ = new Subject<void>();

  readonly form = this.fb.group({
    productoId: ['', Validators.required],
    almacenId: ['', Validators.required],
    tipo: ['ENTRADA', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    motivo: ['', Validators.required]
  });

  readonly productModalForm = this.fb.group({
    nombre: ['', Validators.required],
    costo: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private masterDataService: MasterDataService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.masterDataService.warehouses().subscribe((data) => this.warehouses = data);

    interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.inventoryService.list()),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => this.inventory = data);
  }

  save() {
    this.error = '';
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.inventoryService.registerMovement({
      ...this.form.getRawValue(),
      productoId: Number(this.form.value.productoId),
      almacenId: Number(this.form.value.almacenId)
    } as any).subscribe({
      next: () => {
        this.form.patchValue({ productoId: '', almacenId: '', tipo: 'ENTRADA', cantidad: 1, motivo: '' });
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.inventoryService.list().subscribe((data) => this.inventory = data);
      },
      error: (err) => this.error = err?.error?.error ?? 'No se pudo registrar el movimiento'
    });
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  modalInvalid(form: any, controlName: string) {
    const control = form.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  openProductModal() {
    this.productModalForm.reset({ nombre: '', costo: 0 });
    this.productModalForm.markAsUntouched();
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
  }

  createQuickProduct() {
    this.productModalForm.markAllAsTouched();
    if (this.productModalForm.invalid) {
      return;
    }

    this.masterDataService.createQuickProduct({
      nombre: this.productModalForm.value.nombre || '',
      costo: Number(this.productModalForm.value.costo ?? 0)
    }).subscribe({
      next: (product) => {
        this.loadProducts(product.id);
        this.closeProductModal();
      },
      error: (err) => this.error = err?.error?.error ?? 'No se pudo crear el producto'
    });
  }

  private loadProducts(selectedProductId?: number) {
    this.masterDataService.products().subscribe((data) => {
      this.products = data;
      if (selectedProductId) {
        this.form.patchValue({ productoId: String(selectedProductId) });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
