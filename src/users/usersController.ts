import { Handler } from 'express';
import { UserEdit } from '@/common/schema';
import { JWTPayloadRequest } from '@/loaders/passport';
import { usersService } from './usersService';
import {
  ajv,
  createResponse,
  InvalidIDError,
  SCHEMA,
  BadRequestError,
  DoesNotExistError,
  ForbiddenError,
  ServerError,
} from '@/common';

/** Gets a specific user when provided the id through the url */
const getUser: Handler = async (req, res, next) => {
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
const deleteUser: Handler = async (req, res, next) => {
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
const updateUser: Handler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user as JWTPayloadRequest;
    if (role !== 'ADMIN') {
      return res.status(403).json(createResponse({ error: new ForbiddenError('Only admins can change a users role') }));
    }
    const userId = getUserId(id);
    if (userId instanceof InvalidIDError) {
      return res.status(userId.statusCode).json(createResponse({ error: userId }));
    }
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
const getAllUsers: Handler = async (req, res, next) => {
  try {
    res.json(createResponse({ data: await usersService.getAllUsers() }));
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

export const usersController = { getAllUsers, updateUser, deleteUser, getUser };