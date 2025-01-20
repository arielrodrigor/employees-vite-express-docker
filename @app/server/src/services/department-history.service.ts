import { DepartmentHistory } from '../models/department-history.model';
import { con } from '../providers/mysql/connect';

const getHistoryByEmployeeId = async (
  employeeId: number
): Promise<DepartmentHistory[]> => {
  try {
    const [rows] = await con.query(
      'SELECT dh.*, d.name AS departmentName FROM departments_history dh LEFT JOIN departments d ON dh.department_id = d.id WHERE dh.employee_id = ?;',
      [employeeId]
    );
    return rows as DepartmentHistory[];
  } catch (error) {
    console.error(
      `Error fetching department history for employee ${employeeId}:`,
      error
    );
    throw new Error('Could not fetch department history');
  }
};

export default { getHistoryByEmployeeId };
