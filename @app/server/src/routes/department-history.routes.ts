import { Router } from 'express';

import departmentHistoryController from '../controllers/department-history.controller';

const router = Router();

router.get('/:id', departmentHistoryController.getHistoryByEmployeeId);

export default router;
