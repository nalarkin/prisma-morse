/**
 * API Endpoints that enable users to update their own password.
 */
import { Router } from 'express';
import passport from 'passport';
import * as updateController from './updateController';

const router = Router();

/** Require that users who reset the password be authenticated */
router.use(passport.authenticate('jwt', { session: false }));

router.post('/password', updateController.updatePassword);

export default router;
