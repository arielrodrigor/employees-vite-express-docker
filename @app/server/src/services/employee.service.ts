import { Employee } from '../models/employee.model';
import { con } from '../providers/mysql/connect';

const createEmployee = async (
  employee: Partial<Employee>
): Promise<Employee> => {
  try {
    const [result] = await con.query(
      `INSERT INTO employees (employee_id, first_name, last_name, contact_info, hire_date, active, current_department_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        employee.employeeId,
        employee.firstName,
        employee.lastName,
        employee.contactInfo,
        employee.hireDate,
        true,
        employee.currentDepartmentId
      ]
    );
    return { id: (result as any).insertId, ...employee } as Employee;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw new Error('Could not create employee');
  }
};

const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const [rows] = await con.query(
      `SELECT e.*, d.name AS departmentName
       FROM employees e
       LEFT JOIN departments d ON e.current_department_id = d.id;`
    );
    return rows as Employee[];
  } catch (error) {
    console.error('Error fetching all employees:', error);
    throw new Error('Could not fetch employees');
  }
};

const getEmployeeById = async (id: number): Promise<Employee | null> => {
  try {
    const [rows] = await con.query(
      `SELECT e.*, d.name AS departmentName
       FROM employees e
       LEFT JOIN departments d ON e.current_department_id = d.id
       WHERE e.id = ?;`,
      [id]
    );
    return (rows as Employee[])[0] || null;
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
       SET first_name = ?, last_name = ?, current_department_id = ?, active = ?
       WHERE id = ?;`,
      [
        updates.firstName,
        updates.lastName,
        updates.currentDepartmentId,
        updates.active,
        id
      ]
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

const deleteEmployee = async (id: number): Promise<void> => {
  try {
    await con.query(`DELETE FROM employees WHERE id = ?;`, [id]);
  } catch (error) {
    console.error(`Error deleting employee with ID ${id}:`, error);
    throw new Error('Could not delete employee');
  }
};

export default {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
