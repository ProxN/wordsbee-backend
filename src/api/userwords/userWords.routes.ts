import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware';
import {
  addUserWord,
  getUserWords,
  getUserWord,
  deleteUserWord,
} from './userWords.controller';

const router = Router();

router.route('/').post(protect, addUserWord).get(protect, getUserWords);

router
  .route('/:wordId')
  .get(protect, getUserWord)
  .delete(protect, deleteUserWord);

export default router;
