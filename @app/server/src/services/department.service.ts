import { Department } from '../models/department.model';
import { con } from '../providers/mysql/connect';

const getAllDepartments = async (): Promise<Department[]> => {
  try {
    const [rows] = await con.query('SELECT * FROM departments;');
    return rows as Department[];
  } catch (error) {
    console.error('Error fetching all departments:', error);
    throw new Error('Could not fetch departments');
  }
};

const createDepartment = async (name: string): Promise<Department> => {
  try {
    const [result] = await con.query(
      'INSERT INTO departments (name) VALUES (?);',
      [name]
    );
    return { id: (result as any).insertId, name } as Department;
  } catch (error) {
    console.error('Error creating department:', error);
    throw new Error('Could not create department');
  }
};

export default { getAllDepartments, createDepartment };
