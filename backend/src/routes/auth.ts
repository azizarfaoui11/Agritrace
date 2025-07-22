import { Router, RequestHandler } from 'express';
import { login, logout, register } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/register', register as RequestHandler);

router.post('/login', login as RequestHandler);
router.post('/logout', auth, logout);


export default router; 