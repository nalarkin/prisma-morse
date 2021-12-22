import { Router } from 'express';
import * as refreshController from './refreshController';
import passport from 'passport';

const router = Router();

/**
 * Use HTTPS cookies to generate a new access token.
 * Should I give them updated refresh token as well?
 */
router.post('/refresh/cookie/', refreshController.validateRefreshTokenCookie);

/** Use standard token header with the refresh token to generate a new access token */
router.post(
  '/refresh/header/',
  passport.authenticate('jwt', { session: false }),
  refreshController.generateNewAccessToken,
);

export default router;
