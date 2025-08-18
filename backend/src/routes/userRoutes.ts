import { Router, Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { backendHealth, getProfile } from '../controllers/userController';
import { authorizeRoles } from '../middleware/authRoles';

const router = Router();

router.get('/profile', auth,authorizeRoles('admin'), getProfile);
//router.put('/profile', auth, updateProfile);

router.get('/health', backendHealth);


export default router; 