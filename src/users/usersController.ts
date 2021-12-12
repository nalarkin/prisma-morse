import { RequestHandler } from 'express';
import { UserEdit } from '@/common/schema';
import * as usersService from './usersService';
import { ajv, createResponse, InvalidIDError, SCHEMA, BadRequestError, DoesNotExistError, ServerError } from '@/common';

/** Gets a specific user when provided the id through the url */
export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getUserId(id);
    if (userId instanceof InvalidIDError) {
      return res.status(userId.statusCode).json(createResponse({ error: userId }));
    }
    const user = await usersService.getUser(userId);
    if (user instanceof ServerError) {
      return res.status(user.statusCode).json(createResponse({ error: user }));
    }
    res.json(createResponse({ data: user }));
  } catch (e) {
    next(e);
  }
};

/** Delete the user */
export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getUserId(id);
    if (userId instanceof InvalidIDError) {
      return res.status(userId.statusCode).json(createResponse({ error: userId }));
    }
    const user = await usersService.deleteUser(userId);
    if (user instanceof DoesNotExistError) {
      return res.status(user.statusCode).json(createResponse({ error: user }));
    }
    res.json(createResponse({ data: user }));
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
      throw new Error('Could not find JSON validator');
    }
    const { body } = req;
    if (!validator(body)) {
      // if data in request body is invalid
      return res.status(400).json(createResponse({ error: new BadRequestError(ajv.errorsText(validator.errors)) }));
    }

    const user = await usersService.updateUser(userId, body);
    if (user instanceof ServerError) {
      return res.status(user.statusCode).json(createResponse({ error: user }));
    }
    res.json(createResponse({ data: user }));
  } catch (e) {
    next(e);
  }
};

/** Gets all users in the database */
export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    res.json(createResponse({ data: await usersService.getAllUsers() }));
  } catch (e) {
    next(e);
  }
};

/**
 * Middleware which ensures the id parameter meets the expected format.
 * If invalid, it returns a status 400 and prevents further middlewares from processing.
 * If valid, then it will continue onto the next middleware called.
 */
export const validateUserID: RequestHandler = (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getUserId(id);
    if (userId instanceof InvalidIDError) {
      return res.status(userId.statusCode).json(createResponse({ error: userId }));
    }
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
    throw new Error('Could not find JSON validator');
  }
  if (validateId(userId)) {
    return userId;
  }
  return new InvalidIDError(ajv.errorsText(validateId.errors), 400);
}

// export const usersController = { getAllUsers, updateUser, deleteUser, getUser, validateUserID };
