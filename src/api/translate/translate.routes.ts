import { Router } from 'express';
import translate from './translate.controller';

const router = Router();

router.get('/', translate);

export default router;
