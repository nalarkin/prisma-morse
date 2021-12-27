import createError from 'http-errors';
import type { RequestHandler } from 'express';
import type { UserEdit } from '../common/schema';
import * as usersService from './usersService';
import { ajv, SCHEMA } from '../common';
import type { JWTPayloadRequest } from '../loaders/passport';

/** Gets a specific user when provided the id through the url */
export const getUser: RequestHandler = async (req, res, next) => {
  try {
    return res.json(await usersService.getUser(getValidatedUserId(req.params.id)));
  } catch (e) {
    next(e);
  }
};

export const getCurrentUser: RequestHandler = async (req, res, next) => {
  try {
    return res.json(await usersService.getUser(getValidatedJWTPayload(req.user).sub));
  } catch (e) {
    next(e);
  }
};

/** Delete the user */
export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    return res.json(await usersService.deleteUser(getValidatedUserId(req.params.id)));
  } catch (e) {
    next(e);
  }
};

/** Update a user only if the requester has admin permissions. */
export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    return res.json(await usersService.updateUser(getValidatedUserId(req.params.id), getValidatedUserEdit(req.body)));
  } catch (e) {
    next(e);
  }
};

/** Gets all users in the database */
export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    return res.json(await usersService.getAllUsers());
  } catch (e) {
    next(e);
  }
};

function getValidatedUserEdit(body: unknown) {
  const validator = getUserEditValidator();
  if (!validator(body)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }
  return body;
}

function getUserEditValidator() {
  const validator = ajv.getSchema<UserEdit>(SCHEMA.USER_EDIT);
  if (validator === undefined) {
    throw createError(500, 'Could not find JSON validator');
  }
  return validator;
}

/**
 * Ensures the id parameter meets the expected format.
 * If invalid, it throws a status 400
 * If unable to find validator, throws status 500
 */
function getValidatedUserId(id: unknown) {
  const userId = Number(id);
  const validator = getIDValidator();
  if (validator(userId)) {
    return userId;
  }
  throw createError(400, ajv.errorsText(validator.errors));
}

function getIDValidator() {
  const validator = ajv.getSchema<number>(SCHEMA.USER_ID);
  if (validator === undefined) {
    throw createError(500, 'Could not find JSON validator');
  }
  return validator;
}

function getValidatedJWTPayload(user: unknown) {
  const validator = getJWTPayloadValidator();
  if (!validator(user)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }
  return user;
}

function getJWTPayloadValidator() {
  const validator = ajv.getSchema<JWTPayloadRequest>(SCHEMA.JWT_REQUEST);
  if (validator === undefined) {
    throw createError(500, 'Could not find JSON validator');
  }
  return validator;
}
