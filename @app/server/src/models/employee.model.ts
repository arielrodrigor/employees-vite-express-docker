export interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  contactInfo: string; // JSON string
  hireDate: Date;
  active: boolean;
  terminationDate?: Date;
  currentDepartmentId: number;
  departmentName?: string; // Populated from join query
}
