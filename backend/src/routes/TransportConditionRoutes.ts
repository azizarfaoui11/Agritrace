import express from 'express';
import {
  createTransportCondition,
  getAllTransportConditions,
  updateTransportCondition,
  deleteTransportCondition
} from '../controllers/transportConditionController';

const router = express.Router();

router.post('/create', createTransportCondition);
router.get('/', getAllTransportConditions);
router.put('/:id', updateTransportCondition);
router.delete('/:id', deleteTransportCondition);

export default router;
