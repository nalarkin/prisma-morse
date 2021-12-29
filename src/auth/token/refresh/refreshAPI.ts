/**
 * API Endpoints to allow users to get a new short-lived JWT access token by providing
 * their longer lived JWT refresh token.
 */

import { Router } from 'express';
import passport from 'passport';
import * as refreshController from './refreshController';

const router = Router();

/**
 * Use HTTPS cookies to generate a new access token.
 * Should I give them updated refresh token as well?
 */
router.post('/refresh/cookie/', refreshController.validateRefreshTokenCookie);

/** Use standard token header with the refresh token to generate a new access token */
router.post('/refresh/', passport.authenticate('jwt', { session: false }), refreshController.generateNewAccessToken);

export default router;
