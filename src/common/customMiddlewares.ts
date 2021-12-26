/**
 * File contains express middleware that is used throughout many parts of the application.
 */

import createError from 'http-errors';
import { ajv, SCHEMA, getValidJWTPayload } from '@/common';
import type { RequestHandler } from 'express';

const DEFAULT_MESSAGE = 'You do not have sufficient permissions.';

/**
 * Call this method with an optional error message before you access routes which require admin permissions.
 *
 * This middleware is accessible by method call which allows custom messages to be made, thus increase the
 * reusability of this middleware.
 */
export const getRequireAdminMiddleware = (customMessage = DEFAULT_MESSAGE): RequestHandler => {
  const requireAdminMiddleware: RequestHandler = (req, res, next) => {
    try {
      const { role } = getValidJWTPayload(req.user);
      if (role !== 'ADMIN') {
        // not authorized
        throw createError(403, customMessage);
      }
      next(); // is authorized, allow request to get sent to the following middleware
    } catch (e) {
      next(e);
    }
  };
  return requireAdminMiddleware;
};

/**
 * Middleware that ensures ID param of the url is a valid CUID pattern.
 *
 * Middleware that is added after this middleware will only get executed if url id param
 * is a valid CUID format. If url id param is invalid, then this returns a Bad Request
 * response to the user.
 *
 * This middleware only proves that this CUID follows the proper CUID format, it does
 * not determine if it actually exists in the database.
 *
 * CUIDs follow a certain pattern. To learn more about the pattern,
 * see https://github.com/ericelliott/cuid#broken-down
 */
export const verifyCUIDMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validator = ajv.getSchema<string>(SCHEMA.CUID);
    if (validator === undefined) {
      throw createError(500, 'Could not locate json validator');
    }
    if (!validator(id)) {
      throw createError(400, 'Invalid ID format.');
    }
    next(); // has valid CUID format, allow request to get sent to the following middleware
  } catch (e) {
    next(e);
  }
};

export function getValidCUID(id: unknown) {
  const validator = getCUIDValidator();
  if (!validator(id)) {
    throw createError(400, 'Invalid ID format.');
  }
  return id;
}

function getCUIDValidator() {
  const validator = ajv.getSchema<string>(SCHEMA.CUID);
  if (validator === undefined) {
    throw createError(500, 'Could not locate json validator');
  }
  return validator;
}
