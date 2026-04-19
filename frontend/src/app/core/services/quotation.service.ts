import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Quotation, QuotationRequest } from '../../shared/models/quotation.model';

@Injectable({ providedIn: 'root' })
export class QuotationService {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Quotation[]>(`${environment.apiUrl}/cotizaciones`);
  }

  create(payload: QuotationRequest) {
    return this.http.post<Quotation>(`${environment.apiUrl}/cotizaciones`, payload);
  }
}
