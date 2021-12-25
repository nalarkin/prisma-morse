import createError from 'http-errors';
import type { RequestHandler } from 'express';
import type { UserEdit } from '@/common/schema';
import * as usersService from './usersService';
import { ajv, SCHEMA } from '@/common';
import type { JWTPayloadRequest } from '../loaders/passport';

/** Gets a specific user when provided the id through the url */
export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = Number(id); // we know it's valid because it passed through validation middleware
    return res.json(await usersService.getUser(userId));
  } catch (e) {
    next(e);
  }
};

export const getCurrentUser: RequestHandler = async (req, res, next) => {
  try {
    const { sub: userId } = validateJWTPayload(req.user);
    return res.json(await usersService.getUser(userId));
  } catch (e) {
    next(e);
  }
};

/** Delete the user */
export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = Number(id); // we know it's valid because it passed through validation middleware
    return res.json(await usersService.deleteUser(userId));
  } catch (e) {
    next(e);
  }
};

/** Update a user only if the requester has admin permissions. */
export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = Number(id); // we know it's valid because it passed through validation middleware
    const body = validateUserEdit(req.body);
    return res.json(await usersService.updateUser(userId, body));
  } catch (e) {
    next(e);
  }
};

function validateUserEdit(body: unknown) {
  const validator = ajv.getSchema<UserEdit>(SCHEMA.USER_EDIT);
  if (validator === undefined) {
    throw createError(500, 'Could not find JSON validator');
  }
  if (!validator(body)) {
    // if data in request body is invalid
    throw createError(400, ajv.errorsText(validator.errors));
  }
  return body;
}

/** Gets all users in the database */
export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    return res.json(await usersService.getAllUsers());
  } catch (e) {
    next(e);
  }
};

/**
 * Middleware which ensures the id parameter meets the expected format.
 * If invalid, it returns a status 400 and prevents further middlewares from processing.
 * If valid, then it will continue onto the next middleware called.
 */
export const validateUserIDParam: RequestHandler = (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = Number(id);
    const validateId = ajv.getSchema<number>(SCHEMA.USER_ID);
    if (validateId === undefined) {
      throw createError(500, 'Could not find JSON validator');
    }
    if (!validateId(userId)) {
      throw createError(400, ajv.errorsText(validateId.errors));
    }
    next();
  } catch (e) {
    next(e);
  }
};

function validateJWTPayload(user: unknown) {
  const validator = ajv.getSchema<JWTPayloadRequest>(SCHEMA.JWT_REQUEST);

  if (validator === undefined) {
    throw createError(500, 'Could not find JSON validator');
  }
  if (!validator(user)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }
  return user;
}
