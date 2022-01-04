/**
 * API Endpoints for user initial login authentication.
 */

import { Router } from 'express';
import * as logoutController from './logoutController';

const router = Router();

/**
 * Login user, and return with JWT if successful.
 * Will return an access_token with shorter lifetime, and a refresh_token with longer lifetime.
 */
router.post('/', logoutController.logout);

export default router;
