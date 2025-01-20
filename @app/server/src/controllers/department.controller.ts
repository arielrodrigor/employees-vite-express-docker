import { Request, Response } from 'express';

import departmentService from '../services/department.service';

export default {
  getAllDepartments: async (_req: Request, res: Response) => {
    try {
      const departments = await departmentService.getAllDepartments();
      res.status(200).json(departments);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  },

  createDepartment: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Department name is required' });
      }
      const department = await departmentService.createDepartment(name);
      res.status(201).json(department);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  }
};
