import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeDto } from '../../../models/EmployeeDto.model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update.component.html',
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
    private fb: FormBuilder
  ) { }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((pram) => {
      this.employeeId = Number(pram.get('id'))
    });
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
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
            'An error occurred while fetching employee data',
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
      })
    )
  }

  removeProject(index: number) {
    this.projects.removeAt(index);
  }
}
