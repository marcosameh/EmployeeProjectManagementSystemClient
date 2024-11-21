
 export interface CreateEmployeeDto {
    name: string;
    email: string;
    projects: CreateProjectDto[];
  }
  
  export interface CreateProjectDto {
    name: string;
    description: string; 
    startDate: Date; 
    endDate: Date; 
  }
  