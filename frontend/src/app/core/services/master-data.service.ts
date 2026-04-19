import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Client, Product, QuickCreatePayload, Warehouse } from '../../shared/models/master-data.model';

@Injectable({ providedIn: 'root' })
export class MasterDataService {
  constructor(private http: HttpClient) {}

  clients() {
    return this.http.get<Client[]>(`${environment.apiUrl}/clientes`);
  }

  products() {
    return this.http.get<Product[]>(`${environment.apiUrl}/productos`);
  }

  createQuickProduct(payload: QuickCreatePayload) {
    return this.http.post<Product>(`${environment.apiUrl}/productos/quick`, payload);
  }

  warehouses() {
    return this.http.get<Warehouse[]>(`${environment.apiUrl}/almacenes`);
  }

  createQuickClient(payload: QuickCreatePayload) {
    return this.http.post<Client>(`${environment.apiUrl}/clientes/quick`, payload);
  }
}
