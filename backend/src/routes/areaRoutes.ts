import { Router } from 'express';
import * as areaController from '../controllers/areaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, areaController.addArea);
router.get('/', authMiddleware, areaController.fetchAllAreas);
router.get('/:id', authMiddleware, areaController.fetchAreaById);
router.put('/:id', authMiddleware, areaController.editArea);
router.delete('/:id', authMiddleware, areaController.removeArea);

export default router;