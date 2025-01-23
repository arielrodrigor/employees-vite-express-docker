export interface ContactInfo {
  email?: string;
  phone?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  contactInfo?: ContactInfo;
  hireDate: string;
  active: boolean;
  currentDepartmentId: string;
  departmentName: string;
  terminationDate?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface DepartmentHistory {
  id: string;
  createdAt: string;
  departmentName: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  message?: { type: 'success' | 'error'; text: string };
  onCloseMessage?: () => void;
}
