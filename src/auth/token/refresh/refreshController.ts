import { ACCESS_JWT_EXPIRE, issueJWT, JWTData } from '@/auth/utils';
import { RequestHandler } from 'express';
import * as refreshService from './refreshService';
import * as usersService from '@/users/usersService';

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

    return res.json({ access_token, retrievedToken });
  } catch (e) {
    next(e);
  }
};
/**
 * Returns a response with a new valid short-lived acccess token if the cookies in the request
 * have a valid refresh_token value
 */
export const generateNewAccessToken: RequestHandler = async (req, res, next) => {
  try {
    // const { refresh_token } = req.cookies;
    // const retrievedToken = await refreshService.validateRefreshToken(refresh_token);
    const { sub } = req.user as JWTData;
    const user = await usersService.getUser(sub);
    const access_token = issueJWT(user, ACCESS_JWT_EXPIRE); // new valid short-lived access token
    return res.json({ access_token });
  } catch (e) {
    next(e);
  }
};
