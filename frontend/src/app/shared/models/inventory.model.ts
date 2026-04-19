export interface InventoryItem {
  id: number;
  productoId: number;
  producto: string;
  sku: string;
  almacenId: number;
  almacen: string;
  stock: number;
}

export interface InventoryMovementRequest {
  productoId: number;
  almacenId: number;
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  motivo: string;
}
