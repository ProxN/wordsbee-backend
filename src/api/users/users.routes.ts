import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware';
import * as usersController from './users.controller';

const router = Router();

router.route('/').get(protect, usersController.getAllUsers);

router.get('/me', protect, usersController.getUser);

export default router;
