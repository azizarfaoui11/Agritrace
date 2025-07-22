import express from 'express';
import {
  createImpact,
  getAllImpacts,
  getImpactById,
  updateImpact,
  deleteImpact,
  getEnvironmentByUser
} from '../controllers/EnvironmentImpactController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/create',auth, createImpact);
router.get('/mine',auth,getEnvironmentByUser);

router.get('/', getAllImpacts);
router.get('/:id', getImpactById);
router.put('/update/:id', updateImpact);
router.delete('/delete/:id', deleteImpact);

export default router;
