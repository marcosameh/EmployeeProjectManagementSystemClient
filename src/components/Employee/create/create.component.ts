import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-create',
  standalone: true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  employeeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailUniqueValidator(this.employeeService)], 
      ],
      projects: this.fb.array([]),
    });

  
    this.addProject();
  }


  get projects(): FormArray {
    return this.employeeForm.get('projects') as FormArray;
  }

  
  addProject(): void {
    this.projects.push(
      this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
      })
    );
  }

 
  removeProject(index: number): void {
    if (this.projects.length > 1) {
      this.projects.removeAt(index);
    }
  }

 
  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value;

      this.employeeService.CreateEmployee(employeeData).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success('Employee created successfully');
           this.router.navigateByUrl('employee');
          } else {
            this.toastr.error('Failed to create employee', res.errors.join(', '));
          }
        },
        error: (err) => {
          this.toastr.error('An error occurred while creating the employee', err);
        },
      });
    } else {
      this.toastr.error('Please fill out the form correctly');
    }
  }

    emailUniqueValidator(employeeService: EmployeeService, employeeId?: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
  
      return employeeService.isEmailUnique(control.value, employeeId).pipe(
        map((isUnique) => (isUnique.data ? null : { emailTaken: true })),
        catchError(() => of(null))
      );
    };
  }
}
