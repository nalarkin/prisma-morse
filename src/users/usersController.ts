import type { RequestHandler } from 'express';
import { getValidated, SCHEMA } from '../common';
import type { UserEdit } from '../common/schema';
import type { JWTPayloadRequest } from '../loaders/passport';
import * as usersService from './usersService';

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
  return getValidated<UserEdit>(SCHEMA.USER_EDIT, body);
}

/**
 * Ensures the id parameter meets the expected format.
 * If invalid, it throws a status 400
 * If unable to find validator, throws status 500
 */
function getValidatedUserId(id: unknown) {
  const userId = Number(id);
  return getValidated<number>(SCHEMA.USER_ID, userId);
}

function getValidatedJWTPayload(user: unknown) {
  return getValidated<JWTPayloadRequest>(SCHEMA.JWT_REQUEST, user);
}
