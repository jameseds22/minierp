export interface Client {
  id: number;
  nombre: string;
  documento: string;
}

export interface Product {
  id: number;
  sku: string;
  nombre: string;
  costo?: number;
  precio: number;
}

export interface Warehouse {
  id: number;
  nombre: string;
}

export interface QuickCreatePayload {
  nombre: string;
  costo?: number;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  role: 'ADMIN' | 'VENDEDOR';
}
