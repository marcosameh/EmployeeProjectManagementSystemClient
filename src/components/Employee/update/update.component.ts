import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeDto } from '../../../models/EmployeeDto.model';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update.component.html',
  providers: [DatePipe],
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit {


  employeeId!: number
  employee!: EmployeeDto;
  employeeForm!: FormGroup;
  constructor(private employeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) { }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((pram) => {
      this.employeeId = Number(pram.get('id'))
    });
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailUniqueValidator(this.employeeId)], 
      ],
      projects: this.fb.array([])
    });
    this.getEmployee();

  }
  getEmployee(): void {
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (res) => {
        if (res.success) {
          this.employee = res.data;

          // Populate the form
          this.employeeForm.patchValue({
            name: this.employee.name,
            email: this.employee.email,
          });

          // Populate the projects FormArray
          const projectsFormArray = this.projects;
          this.employee.projects.forEach((project) => {
            projectsFormArray.push(
              this.fb.group({
                id:[project.id],
                name: [project.name, Validators.required],
                description: [project.description, Validators.required],
                startDate: [this.formatDateToString(project.startDate), Validators.required],
                endDate: [this.formatDateToString(project.endDate), [Validators.required, this.endDateValidator()]]
              })
            );
          });
        } else {
          this.toastr.error(
            'An error occurred while fetching employee data',
            res.errors.join(', ')
          );
        }
      },
      error: (err) => {
        this.toastr.error('Error occurred while fetching employee data', err);
      },
    });
  }

  get projects(): FormArray {
    return this.employeeForm.get('projects') as FormArray
  }
  onSubmit() {
    this.employee=this.employeeForm.value;
    this.employee.id=this.employeeId;
    this.employeeService.UpdateEmployee(this.employee).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Employee updated successfully');
          this.router.navigateByUrl('employee');
        } else {
          this.toastr.error(
            'error',
            res.errors.join(', ')
          );
        }
      },
      error: (err) => {
        this.toastr.error('Error occurred while fetching employee data', err);

      },
    })
  }

  addProject() {
    this.projects.push(
      this.fb.group({
        id:[0],
        name: ['', Validators.required],
        description: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', [Validators.required, this.endDateValidator()]]
      })
    )
  }

  removeProject(index: number) {
    this.projects.removeAt(index);
  }

  emailUniqueValidator(employeeId?: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
  
      return this.employeeService.isEmailUnique(control.value, employeeId).pipe(
        map((isUnique) => (isUnique.data ? null : { emailTaken: true })),
        catchError(() => of(null))
      );
    };
}
endDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control.parent as FormGroup;
    if (group) {
      const startDate = group.get('startDate')?.value;
      const endDate = control.value;
      if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
        return { endDateInvalid: true };
      }
    }
    return null;
  };
}
formatDateToString(date: Date): string | null {
  return this.datePipe.transform(date, 'yyyy-MM-dd');
}
}
