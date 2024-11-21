export interface EmployeeDto {
    id: number;
    name: string;
    email: string;
    projects: ProjectDto[];
  }
  
  export interface ProjectDto {
    id: number;
    name: string;
    description: string; 
    startDate: Date; 
    endDate: Date;
  }
  
 