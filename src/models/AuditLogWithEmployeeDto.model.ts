export interface AuditLogWithEmployeeDto {
    auditLogId: number;
    employeeId: number;
    employeeName: string;
    actionTypeId: number;
    actionTypeName: string;
    timestamp: Date;
    oldData?: string;
    newData?: string;
  }
  