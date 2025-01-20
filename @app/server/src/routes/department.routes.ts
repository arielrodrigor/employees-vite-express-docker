import { Router } from 'express';

import departmentController from '../controllers/department.controller';

const router = Router();

router.get('/', departmentController.getAllDepartments);
router.post('/', departmentController.createDepartment);

export default router;
