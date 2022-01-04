import { ErrorRequestHandler } from 'express';
import createError, { HttpError } from 'http-errors';
import { logger } from './logging';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // if (res.headersSent) {
  //   return next(err);
  // }
  logger.error(err.stack);
  if (createError.isHttpError(err)) {
    return res.status(err.statusCode).json(createErrorJsonResponse(err));
  }
  // logger.error(JSON.stringify(err));
  next(err);
};

function createErrorJsonResponse(error: HttpError) {
  return {
    message: error.message,
  };
}
