import { Router } from 'express';
import { loginController } from './loginController';

const router = Router();

/**
 * Login user, and return with JWT if successful.
 * Will return an access_token with shorter lifetime, and a refresh_token with longer lifetime.
 */
router.post('/', loginController.login);

export default router;
