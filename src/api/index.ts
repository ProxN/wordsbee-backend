import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import usersRoutes from './users/users.routes';
import userWordsRoutes from './userwords/userWords.routes';
import translateRoutes from './translate/translate.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/userwords', userWordsRoutes);
router.use('/translate', translateRoutes);

export default router;
