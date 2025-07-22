import express from 'express';
import {
  createVariety,
  getAllVarieties,
  updateVariety,
  deleteVariety,
  getVarietyByUser
} from '../controllers/varietyController';
import {auth} from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/create',auth, upload.single('image'), createVariety);
router.get('/mine',auth,getVarietyByUser)

router.get('/', getAllVarieties);

router.put('/:id', updateVariety);

router.delete('/:id', deleteVariety);


export default router;
