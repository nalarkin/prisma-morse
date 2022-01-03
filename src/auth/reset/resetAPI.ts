/**
 * API Endpoints that enable users to update their own password.
 */
import { Router } from 'express';
import passport from 'passport';
import * as resetController from './resetController';

const router = Router();

/** Require that users who reset the password be authenticated */
router.use(passport.authenticate('jwt', { session: false }));

router.post('/password', resetController.passwordReset);

export default router;
