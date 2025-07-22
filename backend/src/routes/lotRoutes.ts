import express from 'express';
import { Router, Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { authorizeRoles } from '../middleware/authRoles';



import {
  createLot,
  getLotByHash,
  getLotById,
  getAllLots,
  getLotsByUser,
  getLotByName,
  deleteLot,  
  //getReferences
} from '../controllers/lotController';


const router = express.Router();

router.post('/create',auth, createLot);
router.get('/getalllots', getAllLots);
router.get('/mine', auth, getLotsByUser);
router.get('/name/:name', getLotByName);
router.delete("/delete/:id", deleteLot);




router.get('/:id', getLotById);
router.get('/hash/:hash', getLotByHash);


//router.get('/references', getReferences);







export default router;
