import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client, Product, Warehouse } from '../../shared/models/master-data.model';
import { MasterDataService } from '../../core/services/master-data.service';
import { QuotationService } from '../../core/services/quotation.service';
import { Quotation } from '../../shared/models/quotation.model';

@Component({
  standalone: true,
  selector: 'app-cotizaciones',
  imports: [NgFor, NgIf, ReactiveFormsModule, CurrencyPipe],
  template: `
    <div class="grid grid-2">
      <section class="card masked-card">
        <div class="top-actions">
          <button type="button" class="secondary" (click)="openClientModal()">Nuevo cliente</button>
          <button type="button" class="secondary" (click)="openProductModal()">Nuevo producto</button>
        </div>
        <h2>Nueva cotizacion</h2>
        <form [formGroup]="form" (ngSubmit)="save()" class="grid">
          <select formControlName="clienteId" [class.field-error]="isInvalid('clienteId')">
            <option value="">Cliente</option>
            <option *ngFor="let client of clients" [value]="client.id">{{ client.nombre }}</option>
          </select>
          <p class="field-help" *ngIf="isInvalid('clienteId')">Selecciona un cliente.</p>

          <select formControlName="almacenId" [class.field-error]="isInvalid('almacenId')">
            <option value="">Almacen</option>
            <option *ngFor="let warehouse of warehouses" [value]="warehouse.id">{{ warehouse.nombre }}</option>
          </select>
          <p class="field-help" *ngIf="isInvalid('almacenId')">Selecciona un almacen.</p>

          <select formControlName="estado" [class.field-error]="isInvalid('estado')">
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="APROBADO">APROBADO</option>
          </select>

          <div formArrayName="items" class="grid">
            <div class="card" *ngFor="let group of items.controls; let i = index" [formGroupName]="i">
              <select formControlName="productoId" [class.field-error]="itemInvalid(i, 'productoId')">
                <option value="">Producto</option>
                <option *ngFor="let product of products" [value]="product.id">
                  {{ product.nombre }} - S/ {{ product.precio }}
                </option>
              </select>
              <p class="field-help" *ngIf="itemInvalid(i, 'productoId')">Selecciona un producto.</p>

              <input type="number" formControlName="cantidad" placeholder="Cantidad" [class.field-error]="itemInvalid(i, 'cantidad')" />
              <p class="field-help" *ngIf="itemInvalid(i, 'cantidad')">Ingresa una cantidad valida.</p>
            </div>
          </div>

          <button type="button" class="secondary" (click)="addItem()">Agregar producto</button>
          <button type="submit">Generar cotizacion</button>
        </form>

        <div class="card" style="margin-top: 16px;">
          <p>Subtotal estimado: {{ subtotal() | currency:'PEN ':'symbol':'1.2-2' }}</p>
          <p>IGV estimado: {{ igv() | currency:'PEN ':'symbol':'1.2-2' }}</p>
          <p><strong>Total estimado: {{ total() | currency:'PEN ':'symbol':'1.2-2' }}</strong></p>
        </div>
        <p class="error" *ngIf="error">{{ error }}</p>
      </section>

      <section class="card masked-card">
        <h2>Historial</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Subtotal</th>
              <th>IGV</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let quotation of quotations">
              <td>{{ quotation.id }}</td>
              <td>{{ quotation.estado }}</td>
              <td>{{ quotation.subtotal | currency:'PEN ':'symbol':'1.2-2' }}</td>
              <td>{{ quotation.igv | currency:'PEN ':'symbol':'1.2-2' }}</td>
              <td>{{ quotation.total | currency:'PEN ':'symbol':'1.2-2' }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <div class="modal-backdrop" *ngIf="showClientModal" (click)="closeClientModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>Nuevo cliente</h3>
        <p>Ingresa el nombre del cliente y lo agregaremos inmediatamente al selector.</p>
        <form [formGroup]="clientModalForm" (ngSubmit)="createQuickClient()">
          <input formControlName="nombre" placeholder="Nombre del cliente" [class.field-error]="modalInvalid(clientModalForm, 'nombre')" />
          <p class="field-help" *ngIf="modalInvalid(clientModalForm, 'nombre')">El nombre es obligatorio.</p>

          <div class="modal-actions">
            <button type="button" class="secondary" (click)="closeClientModal()">Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showProductModal" (click)="closeProductModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>Nuevo producto</h3>
        <p>Ingresa el nombre y el costo del producto para agregarlo al catalogo.</p>
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
export class CotizacionesComponent implements OnInit {
  clients: Client[] = [];
  products: Product[] = [];
  warehouses: Warehouse[] = [];
  quotations: Quotation[] = [];
  error = '';
  priceMap: Record<number, number> = {};
  showClientModal = false;
  showProductModal = false;

  readonly form = this.fb.group({
    clienteId: ['', Validators.required],
    almacenId: ['', Validators.required],
    estado: ['PENDIENTE', Validators.required],
    items: this.fb.array([])
  });

  readonly clientModalForm = this.fb.group({
    nombre: ['', Validators.required]
  });

  readonly productModalForm = this.fb.group({
    nombre: ['', Validators.required],
    costo: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(private fb: FormBuilder, private masterDataService: MasterDataService, private quotationService: QuotationService) {}

  get items() {
    return this.form.get('items') as FormArray;
  }

  ngOnInit() {
    this.addItem();
    this.loadClients();
    this.loadProducts();
    this.masterDataService.warehouses().subscribe((data) => this.warehouses = data);
    this.reload();
  }

  addItem() {
    this.items.push(this.fb.group({
      productoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  save() {
    this.error = '';
    this.form.markAllAsTouched();
    this.items.controls.forEach((group) => group.markAllAsTouched());
    if (this.form.invalid || this.items.length === 0) {
      return;
    }

    const payload = {
      clienteId: Number(this.form.value.clienteId),
      almacenId: Number(this.form.value.almacenId),
      estado: this.form.value.estado,
      items: this.items.getRawValue().map((item) => ({
        productoId: Number(item.productoId),
        cantidad: Number(item.cantidad)
      }))
    };

    this.quotationService.create(payload as any).subscribe({
      next: () => {
        this.form.patchValue({ clienteId: '', almacenId: '', estado: 'PENDIENTE' });
        while (this.items.length > 0) {
          this.items.removeAt(0);
        }
        this.addItem();
        this.reload();
      },
      error: (err) => this.error = err?.error?.error ?? 'No se pudo generar la cotizacion'
    });
  }

  subtotal() {
    return this.items.controls.reduce((acc, group) => {
      const productId = Number(group.value.productoId);
      const cantidad = Number(group.value.cantidad ?? 0);
      return acc + ((this.priceMap[productId] ?? 0) * cantidad);
    }, 0);
  }

  igv() {
    return this.subtotal() * 0.18;
  }

  total() {
    return this.subtotal() + this.igv();
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  itemInvalid(index: number, controlName: string) {
    const control = this.items.at(index).get(controlName);
    return !!control && control.invalid && control.touched;
  }

  modalInvalid(form: any, controlName: string) {
    const control = form.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  openClientModal() {
    this.clientModalForm.reset({ nombre: '' });
    this.clientModalForm.markAsUntouched();
    this.showClientModal = true;
  }

  closeClientModal() {
    this.showClientModal = false;
  }

  openProductModal() {
    this.productModalForm.reset({ nombre: '', costo: 0 });
    this.productModalForm.markAsUntouched();
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
  }

  createQuickClient() {
    this.clientModalForm.markAllAsTouched();
    if (this.clientModalForm.invalid) {
      return;
    }

    this.masterDataService.createQuickClient({
      nombre: this.clientModalForm.value.nombre || ''
    }).subscribe({
      next: (client) => {
        this.loadClients(client.id);
        this.closeClientModal();
      },
      error: (err) => this.error = err?.error?.error ?? 'No se pudo crear el cliente'
    });
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
        const lastIndex = this.items.length - 1;
        if (lastIndex >= 0) {
          this.items.at(lastIndex).patchValue({ productoId: String(product.id) });
        }
        this.closeProductModal();
      },
      error: (err) => this.error = err?.error?.error ?? 'No se pudo crear el producto'
    });
  }

  private loadClients(selectedClientId?: number) {
    this.masterDataService.clients().subscribe((data) => {
      this.clients = data;
      if (selectedClientId) {
        this.form.patchValue({ clienteId: String(selectedClientId) });
      }
    });
  }

  private loadProducts(selectedProductId?: number) {
    this.masterDataService.products().subscribe((data) => {
      this.products = data;
      this.priceMap = Object.fromEntries(data.map(item => [item.id, item.precio]));
      if (selectedProductId) {
        const lastIndex = this.items.length - 1;
        if (lastIndex >= 0) {
          this.items.at(lastIndex).patchValue({ productoId: String(selectedProductId) });
        }
      }
    });
  }

  private reload() {
    this.quotationService.list().subscribe((data) => this.quotations = data);
  }
}
