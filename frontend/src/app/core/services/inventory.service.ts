import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { InventoryItem, InventoryMovementRequest } from '../../shared/models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<InventoryItem[]>(`${environment.apiUrl}/inventario`);
  }

  registerMovement(payload: InventoryMovementRequest) {
    return this.http.post<InventoryItem>(`${environment.apiUrl}/inventario/movimientos`, payload);
  }
}
