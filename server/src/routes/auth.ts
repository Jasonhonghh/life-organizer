import { Router } from 'express';
import { registerController, loginController, getCurrentUserController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', authenticate, getCurrentUserController);

export default router;
