import { Component, signal } from '@angular/core';
import { DecimalPipe, NgFor } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';
import { QuotationService } from '../../core/services/quotation.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [DecimalPipe, NgFor],
  template: `
    <div class="grid grid-2">
      <section class="card">
        <h2>Indicadores</h2>
        <div class="grid grid-2">
          <div class="card">
            <strong>{{ inventoryCount() }}</strong>
            <p>Registros de inventario</p>
          </div>
          <div class="card">
            <strong>{{ quotationCount() }}</strong>
            <p>Cotizaciones registradas</p>
          </div>
        </div>
      </section>

      <section class="card">
        <h2>Resumen rápido</h2>
        <p>Esta base incluye autenticación JWT, control de stock por almacén y cotizaciones con cálculo automático de IGV.</p>
        <ul>
          <li>El inventario se refresca cada 5 segundos en la vista dedicada.</li>
          <li>La cotización descuenta stock al momento de generarse.</li>
          <li>Los roles disponibles son ADMIN y VENDEDOR.</li>
        </ul>
      </section>
    </div>
  `
})
export class DashboardComponent {
  readonly inventoryCount = signal(0);
  readonly quotationCount = signal(0);

  constructor(inventoryService: InventoryService, quotationService: QuotationService) {
    inventoryService.list().subscribe((items) => this.inventoryCount.set(items.length));
    quotationService.list().subscribe((items) => this.quotationCount.set(items.length));
  }
}
