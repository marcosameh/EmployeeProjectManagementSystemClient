import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { EmployeeDto } from '../../../models/EmployeeDto.model';
import {DataTablesModule} from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {Router, RouterLink} from '@angular/router';
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports:[DataTablesModule,RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
DeleteEmployee() {
throw new Error('Method not implemented.');
}
employees: EmployeeDto[] = [];
dtoptions: Config= {};
dtTrigger:Subject<any>=new Subject<any>();

constructor(private employeeService:EmployeeService,
  private toastr: ToastrService,
  private router: Router
) {}


  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers'
     };
     this.LoadEmployees();
    
  }
  LoadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        if (res.success) {
          this.employees = res.data;
          this.dtTrigger.next(null);
        } else {
          this.toastr.error('Failed to load employees', res.errors.join(', '));
        }
      },
      error: (err) => {
        this.toastr.error('An error occurred while fetching the employees', err);
      }
    });
  }
  confirmDelete(employeeId: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.deleteEmployee(employeeId);
    }
  }

  deleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Employee deleted successfully');
          window.location.reload();
        } else {
          this.toastr.error('Failed to delete employee', res.errors.join(', '));
        }
      },
      error: (err) => {
        this.toastr.error('An error occurred while deleting the employee', err);
      }
    });
  }

}
