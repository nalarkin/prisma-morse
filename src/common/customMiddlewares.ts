import { RequestHandler } from 'express';
import { JWTData } from '@/auth/utils';
import { createResponse, ForbiddenError } from '@/common';

const DEFAULT_MESSAGE = 'You do not have sufficient permissions.';

/** Call this method with an optional error message before you access routes which require admin permissions. */
export const getRequireAdminMiddleware = (customMessage = DEFAULT_MESSAGE): RequestHandler => {
  const requireAdminMiddleware: RequestHandler = (req, res, next) => {
    const { role } = req.user as JWTData;
    if (role !== 'ADMIN') {
      // not authorized
      return res.status(403).json(createResponse({ error: new ForbiddenError(customMessage) }));
    }
    next();
  };
  return requireAdminMiddleware;
};
