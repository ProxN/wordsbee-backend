import { Router } from 'express';
import * as authController from './auth.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signIn);
router.patch('/updatePassword', protect, authController.updatePassword);
router.get('/logout', protect, authController.logout);

export default router;
