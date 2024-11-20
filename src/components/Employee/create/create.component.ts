import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
      email: ['', [Validators.required, Validators.email]],
      projects: this.fb.array([]),
    });

    // Add one project by default
    this.addProject();
  }

  // Getter for projects FormArray
  get projects(): FormArray {
    return this.employeeForm.get('projects') as FormArray;
  }

  // Add a project to the FormArray
  addProject(): void {
    this.projects.push(
      this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
      })
    );
  }

  // Remove a project from the FormArray
  removeProject(index: number): void {
    if (this.projects.length > 1) {
      this.projects.removeAt(index);
    }
  }

  // Submit the form
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
}
