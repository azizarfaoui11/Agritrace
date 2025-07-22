import express from 'express';
import {
  createStorageCondition,
  getAllStorageConditions,
  updateStorageCondition,
  deleteStorageCondition
} from '../controllers/storageConditionController';

const router = express.Router();

router.post('/create', createStorageCondition);
router.get('/', getAllStorageConditions);
router.put('/:id', updateStorageCondition);
router.delete('/:id', deleteStorageCondition);

export default router;
