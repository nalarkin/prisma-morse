import { RequestHandler } from 'express';
import { UserEdit } from '@/common/schema';
import * as usersService from './usersService';
import { ajv, SCHEMA } from '@/common';
import createError from 'http-errors';

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
    const validator = ajv.getSchema<UserEdit>(SCHEMA.USER_EDIT);
    if (validator === undefined) {
      throw createError(500, 'Could not find JSON validator');
    }
    const { body } = req;
    if (!validator(body)) {
      // if data in request body is invalid
      throw createError(400, ajv.errorsText(validator.errors));
    }
    return res.json(await usersService.updateUser(userId, body));
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

/**
 * Middleware which ensures the id parameter meets the expected format.
 * If invalid, it returns a status 400 and prevents further middlewares from processing.
 * If valid, then it will continue onto the next middleware called.
 */
export const validateUserIDParam: RequestHandler = (req, res, next) => {
  try {
    const { id } = req.params;
    getUserId(id);
    next();
  } catch (e) {
    next(e);
  }
};

/**
 * Helper function that validates that the user id is a valid format.
 * Performs more robust checks and is quicker and less repetitive than a
 * manual implementation.
 */
function getUserId(id: string) {
  const userId = Number(id);
  const validateId = ajv.getSchema<number>(SCHEMA.USER_ID);
  if (validateId === undefined) {
    throw createError(500, 'Could not find JSON validator');
  }
  if (!validateId(userId)) {
    throw createError(400, ajv.errorsText(validateId.errors));
  }
  return userId;
}
