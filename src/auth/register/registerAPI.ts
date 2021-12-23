import { Router } from 'express';
import * as registerController from './registerController';

const router = Router();

/** Register a user */
router.post('/', registerController.registerUser);

export default router;
