import { ACCESS_JWT_EXPIRE, issueJWT } from '../../../auth/utils';
import type { RequestHandler } from 'express';
import * as refreshService from './refreshService';
import * as usersService from '../../../users/usersService';
import { getValidJWTPayload } from '../../../common';

/**
 * Returns a response with a new valid short-lived acccess token if the cookies in the request
 * have a valid refresh_token value
 */
export const validateRefreshTokenCookie: RequestHandler = async (req, res, next) => {
  try {
    const { refresh_token } = req.cookies;
    const retrievedToken = await refreshService.validateRefreshToken(refresh_token);
    const user = await usersService.getUser(retrievedToken.sub);
    const access_token = issueJWT(user, ACCESS_JWT_EXPIRE); // new valid short-lived access token

    return res.json({ access_token });
  } catch (e) {
    next(e);
  }
};
/**
 * Returns a response with a new valid short-lived acccess token if the JWT passed in the Auth header is valid
 */
export const generateNewAccessToken: RequestHandler = async (req, res, next) => {
  try {
    const { sub } = getValidJWTPayload(req.user);
    const user = await usersService.getUser(sub);
    const access_token = issueJWT(user, ACCESS_JWT_EXPIRE); // new valid short-lived access token
    return res.json({ access_token });
  } catch (e) {
    next(e);
  }
};
