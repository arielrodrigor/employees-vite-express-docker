import { Employee } from '../models/employee.model';
import { con } from '../providers/mysql/connect';

const generateEmployeeId = (firstName: string, lastName: string): string => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumber}`;
};

const mapDbToModel = (dbRow: any): Employee => {
  let contactInfo;
  try {
    contactInfo =
      typeof dbRow.contact_info === 'string'
        ? JSON.parse(dbRow.contact_info)
        : dbRow.contact_info;
  } catch {
    contactInfo = {};
  }
  return {
    id: dbRow.id,
    employeeId: dbRow.employee_id,
    firstName: dbRow.first_name,
    lastName: dbRow.last_name,
    contactInfo,
    hireDate: new Date(dbRow.hire_date),
    active: dbRow.active === 1,
    terminationDate: dbRow.termination_date
      ? new Date(dbRow.termination_date)
      : undefined,
    currentDepartmentId: dbRow.current_department_id,
    departmentName: dbRow.departmentName
  };
};

const createEmployee = async (
  employee: Partial<Employee>
): Promise<Employee> => {
  try {
    const employeeId =
      employee.employeeId ??
      generateEmployeeId(employee.firstName!, employee.lastName!);

    const [result] = await con.query(
      `INSERT INTO employees (employee_id, first_name, last_name, contact_info, hire_date, active, current_department_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeId,
        employee.firstName,
        employee.lastName,
        JSON.stringify(employee.contactInfo), // Convertir a JSON string
        employee.hireDate,
        true,
        employee.currentDepartmentId
      ]
    );

    return {
      id: (result as any).insertId,
      employeeId,
      ...employee,
      active: true // Forzar campo activo por defecto
    } as Employee;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw new Error('Could not create employee');
  }
};

const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const [rows] = await con.query(
      `SELECT e.id, e.employee_id, e.first_name, e.last_name, e.contact_info, 
              e.hire_date, e.active, e.termination_date, e.current_department_id, 
              d.name AS departmentName
       FROM employees e
       LEFT JOIN departments d ON e.current_department_id = d.id;`
    );
    return (rows as any[]).map(mapDbToModel);
  } catch (error) {
    console.error('Error fetching all employees:', error);
    throw new Error('Could not fetch employees');
  }
};

const getEmployeeById = async (id: number): Promise<Employee | null> => {
  try {
    const [rows] = await con.query(
      `SELECT e.id, e.employee_id, e.first_name, e.last_name, e.contact_info, 
              e.hire_date, e.active, e.termination_date, e.current_department_id, 
              d.name AS departmentName
       FROM employees e
       LEFT JOIN departments d ON e.current_department_id = d.id
       WHERE e.id = ?;`,
      [id]
    );
    return rows.length > 0 ? mapDbToModel(rows[0]) : null;
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    throw new Error('Could not fetch employee');
  }
};

const updateEmployee = async (
  id: number,
  updates: Partial<Employee>
): Promise<void> => {
  try {
    await con.query(
      `UPDATE employees
       SET  current_department_id = ?
       WHERE id = ?;`,
      [updates.currentDepartmentId, id]
    );

    if (updates.currentDepartmentId) {
      await con.query(
        `INSERT INTO departments_history (employee_id, department_id) VALUES (?, ?)`,
        [id, updates.currentDepartmentId]
      );
    }
  } catch (error) {
    console.error(`Error updating employee with ID ${id}:`, error);
    throw new Error('Could not update employee');
  }
};

const updateEmployeeStatus = async (
  id: number,
  active: boolean
): Promise<void> => {
  try {
    const terminationDate = !active
      ? new Date().toISOString().split('T')[0]
      : null;
    await con.query(
      `UPDATE employees 
       SET active = ?, termination_date = ? 
       WHERE id = ?;`,
      [active, terminationDate, id]
    );
  } catch (error) {
    console.error(`Error updating employee status with ID ${id}:`, error);
    throw new Error('Could not update employee status');
  }
};

export default {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus
};
