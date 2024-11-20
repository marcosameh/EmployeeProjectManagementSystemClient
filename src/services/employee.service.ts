import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse.model';
import { CreateEmployeeDto } from '../models/CreateEmployeeDto.model';
import { EmployeeDto } from '../models/EmployeeDto.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = `${environment.MainBaseUrl}/api/employee`;
  constructor(private http:HttpClient) { }

  CreateEmployee(createEmployeeDto:CreateEmployeeDto):Observable<ApiResponse<Number>>{
    return this.http.post<ApiResponse<Number>>(`${this.apiUrl}`,createEmployeeDto)
  }
  getEmployee(id: number): Observable<ApiResponse<EmployeeDto>> {
    return this.http.get<ApiResponse<EmployeeDto>>(`${this.apiUrl}/${id}`);
  }
  getEmployees(): Observable<ApiResponse<EmployeeDto[]>> {
    return this.http.get<ApiResponse<EmployeeDto[]>>(`${this.apiUrl}`);
  }
  UpdateEmployee(employeeDto:EmployeeDto):Observable<ApiResponse<Number>>{
    return this.http.put<ApiResponse<Number>>(`${this.apiUrl}`,employeeDto)
  }
  deleteEmployee(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}
