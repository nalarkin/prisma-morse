import { ACCESS_JWT_EXPIRE, issueJWT } from '@/auth/utils';
import { createResponse, ServerError } from '@/common';
import { RequestHandler } from 'express';
import * as refreshService from './refreshService';
import * as usersService from '@/users/usersService';

/**
 * Returns a response with a new valid short-lived acccess token if the cookies in the request
 * have a valid refresh_token value
 */
export const validateRefreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { refresh_token } = req.cookies;
    const retrievedToken = await refreshService.validateRefreshToken(refresh_token);
    if (retrievedToken instanceof ServerError) {
      return res.status(retrievedToken.statusCode).json(createResponse({ error: retrievedToken }));
    }
    const user = await usersService.getUser(retrievedToken.sub);
    if (user instanceof ServerError) {
      return res.status(user.statusCode).json(createResponse({ error: user }));
    }

    const access_token = issueJWT(user, ACCESS_JWT_EXPIRE); // new valid short-lived access token
    const data = { access_token, retrievedToken };

    return res.json(createResponse({ data }));
  } catch (e) {
    next(e);
  }
};
