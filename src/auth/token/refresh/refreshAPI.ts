import { Router } from 'express';
import * as refreshController from './refreshController';

const router = Router();

/**
 * Give user a newly created short-lifetime JWT
 * Should I give them updated refresh token as well?
 */
router.post('/refresh/', refreshController.validateRefreshToken);

export default router;
