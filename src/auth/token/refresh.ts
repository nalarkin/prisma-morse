import express from 'express';
import { ACCESS_JWT_EXPIRE, JWTData, REFRESH_JWT_EXPIRE, verifyPassword } from '../utils';
import { issueJWT } from '../utils';
import prisma from '../../config/database';
import { ajv } from '../../common/validation';
import { createResponse } from '../../common/response';
import passport from 'passport';
import { RefreshTokenRequest } from '../../common/schema/schema_token';
import { User } from '@prisma/client';
import { logger } from '../../config/logging';

const router = express.Router();

/**
 * Give user a newly created short-lifetime JWT
 * Should I give them updated refresh token as well?
 */
router.post('/auth/token/refresh/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { sub: id } = req.user as JWTData;

    // search for user in database
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user === null) {
      return res.status(401).json(
        createResponse({
          error: 'JWT has invalid content, please sign in again',
        }),
      );
    }

    // they are authenticated, so give them a JWT for future requests
    const payload = {
      access_token: issueJWT(user, ACCESS_JWT_EXPIRE),
    };
    res.json(createResponse({ data: payload }));
  } catch (e) {
    next(e);
  }
});

export default router;
