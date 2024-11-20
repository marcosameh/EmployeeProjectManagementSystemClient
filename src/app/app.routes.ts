import { Routes } from '@angular/router';
import { EmployeeListComponent } from '../components/Employee/employee-list/employee-list.component';
import { UpdateComponent } from '../components/Employee/update/update.component';
import { CreateComponent } from '../components/Employee/create/create.component';
import { LogListComponent } from '../components/log-list/log-list.component';

export const routes: Routes =
 [
    { path: 'employee', component: EmployeeListComponent },
    { path: 'employee/update/:id', component: UpdateComponent },
    { path: 'employee/create', component: CreateComponent },
    { path: 'log', component: LogListComponent },
    { path: '', redirectTo: '/employee', pathMatch: 'full' }
 ];
