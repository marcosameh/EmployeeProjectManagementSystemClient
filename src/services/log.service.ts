import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse.model';
import { AuditLogWithEmployeeDto } from '../models/AuditLogWithEmployeeDto.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = `${environment.AuditLogBaseUrl}/api/log`;
  constructor(private http:HttpClient){}

  getLogs(): Observable<ApiResponse<AuditLogWithEmployeeDto[]>> {
    return this.http.get<ApiResponse<AuditLogWithEmployeeDto[]>>(`${this.apiUrl}`);
  }
}
