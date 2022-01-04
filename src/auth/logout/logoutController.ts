import dayjs from 'dayjs';
import type { RequestHandler, Response } from 'express';

/**
 * Handles the login process, including password verification and issuing access and
 * refersh tokens on successful login.
 */
export const logout: RequestHandler = (req, res, next) => {
  try {
    return createLogoutResponse(res);
  } catch (e) {
    next(e);
  }
};

function createLogoutResponse(res: Response) {
  res.clearCookie('refresh_token', {
    // @TODO: during first deployment, you will need to uncomment the line below, because we wont have https yet
    // secure: process.env.NODE_ENV !== 'development', // if secure it can only be sent over https
    secure: false, // remove this line when after achieving HTTPS in production
    httpOnly: true, // provides improved security against cross site scripting attacks
    expires: dayjs().add(7, 'days').toDate(), // note, this should line up with REFRESH_JWT_EXIPIRE time
    path: '/api/auth/token/refresh/', // only gets sent on requests to this path
  });
  return res.json({});
}
