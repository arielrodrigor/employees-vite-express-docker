import { Request, Response } from 'express';

import departmentHistoryService from '../services/department-history.service';

export default {
  getHistoryByEmployeeId: async (req: Request, res: Response) => {
    try {
      const employeeId = Number(req.params.id);
      if (Number.isNaN(employeeId)) {
        return res.status(400).json({ message: 'Invalid employee ID' });
      }
      const history =
        await departmentHistoryService.getHistoryByEmployeeId(employeeId);
      res.status(200).json(history);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  }
};
