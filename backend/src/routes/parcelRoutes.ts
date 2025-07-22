import express from 'express';
import {
  createParcel,
  getAllParcel,
  getParcelById,
  updateParcel,
  deleteParcel,
  getParcelsByUser,
} from '../controllers/parcelController';
import {auth} from '../middleware/auth';

const router = express.Router();

router.post('/create',auth, createParcel);
router.get('/mine', auth, getParcelsByUser);

router.get('/', getAllParcel);

router.get('/:id', getParcelById);

router.put('/update/:id', updateParcel);

router.delete('/delete/:id', deleteParcel);


export default router;
