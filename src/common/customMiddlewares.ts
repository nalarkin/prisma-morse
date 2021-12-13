import { RequestHandler } from 'express';
import { JWTData } from '@/auth/utils';
import { ajv, BadRequestError, createResponse, ForbiddenError, SCHEMA } from '@/common';

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

/**
 * CUIDs follow a certain pattern. To learn more about the pattern,
 * see https://github.com/ericelliott/cuid#broken-down
 */
export const verifyCUIDMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validator = ajv.getSchema<string>(SCHEMA.CUID);
    if (validator === undefined) {
      throw new Error('Could not locate json validator');
    }
    if (!validator(id)) {
      return res.status(400).json(createResponse({ error: new BadRequestError('Invalid ID format.') }));
    }
    next();
  } catch (e) {
    next(e);
  }
};
