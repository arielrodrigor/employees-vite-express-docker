import { Request, Response } from 'express';

import employeeService from '../services/employee.service';

export default {
  createEmployee: async (req: Request, res: Response) => {
    try {
      const employee = await employeeService.createEmployee(req.body);
      res.status(201).json(employee);
    } catch (error: any) {
      console.error('Error creating employee:', error.message);
      res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  },

  getAllEmployees: async (_req: Request, res: Response) => {
    try {
      const employees = await employeeService.getAllEmployees();
      res.status(200).json(employees);
    } catch (error: any) {
      console.error('Error fetching all employees:', error.message);
      res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  },

  getEmployeeById: async (req: Request, res: Response) => {
    try {
      const employeeId = Number(req.params.id);
      if (Number.isNaN(employeeId)) {
        return res.status(400).json({ message: 'Invalid employee ID' });
      }

      const employee = await employeeService.getEmployeeById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.status(200).json(employee);
    } catch (error: any) {
      console.error(
        `Error fetching employee with ID ${req.params.id}:`,
        error.message
      );
      res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  },

  updateEmployee: async (req: Request, res: Response) => {
    try {
      const employeeId = Number(req.params.id);
      if (Number.isNaN(employeeId)) {
        return res.status(400).json({ message: 'Invalid employee ID' });
      }

      await employeeService.updateEmployee(employeeId, req.body);
      res.status(204).send();
    } catch (error: any) {
      console.error(
        `Error updating employee with ID ${req.params.id}:`,
        error.message
      );

      if (error.message.includes('not found')) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  },

  deleteEmployee: async (req: Request, res: Response) => {
    try {
      const employeeId = Number(req.params.id);
      if (Number.isNaN(employeeId)) {
        return res.status(400).json({ message: 'Invalid employee ID' });
      }

      await employeeService.deleteEmployee(employeeId);
      res.status(204).send();
    } catch (error: any) {
      console.error(
        `Error deleting employee with ID ${req.params.id}:`,
        error.message
      );

      if (error.message.includes('not found')) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  }
};
