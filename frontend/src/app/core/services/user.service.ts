import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CreateUserPayload } from '../../shared/models/master-data.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  create(payload: CreateUserPayload) {
    return this.http.post(`${environment.apiUrl}/usuarios`, payload);
  }
}
