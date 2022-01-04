import { ErrorRequestHandler } from 'express';
import createError, { HttpError } from 'http-errors';
import { logger } from './logging';

/**
 * Logs stack trace to console and then returns a response to the client with the relevant info in the json body.
 *
 * This is different from the default behavior of rending a HMTL file with the stack trace. The JSON body can be parsed by the front end more easily.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err.stack);
  if (createError.isHttpError(err)) {
    return res.status(err.statusCode).json(createErrorJsonResponse(err));
  }
  next(err);
};

function createErrorJsonResponse(error: HttpError) {
  return {
    message: error.message,
  };
}
