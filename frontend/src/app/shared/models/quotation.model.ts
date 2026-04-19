export interface QuotationItemRequest {
  productoId: number;
  cantidad: number;
}

export interface QuotationRequest {
  clienteId: number;
  almacenId: number;
  estado: 'PENDIENTE' | 'APROBADO';
  items: QuotationItemRequest[];
}

export interface Quotation {
  id: number;
  subtotal: number;
  igv: number;
  total: number;
  estado: string;
  fecha: string;
}
