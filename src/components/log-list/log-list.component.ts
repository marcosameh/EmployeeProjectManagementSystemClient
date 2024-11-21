import { Component, OnInit } from '@angular/core';
import {DataTablesModule} from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import { AuditLogWithEmployeeDto } from '../../models/AuditLogWithEmployeeDto.model';
import { LogService } from '../../services/log.service';
@Component({
  selector: 'app-log-list',
  standalone: true,
  imports:[DataTablesModule],
  templateUrl: './log-list.component.html',
  styleUrl: './log-list.component.css'
})
export class LogListComponent implements OnInit{
 

  logs: AuditLogWithEmployeeDto[] = [];
  dtoptions: Config= {};
  dtTrigger:Subject<any>=new Subject<any>();
  
  constructor(private logService:LogService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  
  
    ngOnInit(): void {
      this.dtoptions = {
        pagingType: 'full_numbers'
       };
       this.LoadLogs();
      
    }
    LoadLogs(): void {
      this.logService.getLogs().subscribe({
        next: (res) => {
          if (res.success) {
            this.logs = res.data;
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
    
 
  
}




