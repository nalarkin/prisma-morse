import { ajv, createResponse, InvalidIDError, SCHEMA } from '@/common';
import { UserEdit } from '@/common/schema/schema_user';
import { JWTPayloadRequest } from '@/loaders/passport';
import { Handler } from 'express';
import { usersService } from './usersService';
import { BadRequestError, DoesNotExistError, ForbiddenError } from '../common/response';

/**
 *I think of controllers as "orchestrators". They call the services, which contain more "pure" business logic. 
 But by themselves,controllers don't really contain any logic other than handling the request and calling services. 
 The services do most of the work, while the controllers orchestrate the service calls and decide what to do with the data returned.
 */

const getUser: Handler = async (req, res, next) => {
  // async getUser(id: number) {
  try {
    const { id } = req.params;
    const userId = getUserId(id);
    if (userId instanceof InvalidIDError) {
      return res.status(userId.statusCode).json(createResponse({ error: userId }));
    }
    const user = await usersService.getUser(userId);
    if (user === null) {
      return res.status(404).json(createResponse({ error: new DoesNotExistError('Item does not exist') }));
    }
    res.json(createResponse({ data: user }));
  } catch (e) {
    next(e);
  }
  // return { user: await usersService.getUser(id) };
};
const deleteUser: Handler = async (req, res, next) => {
  const { id } = req.params;
  const userId = getUserId(id);
  if (userId instanceof InvalidIDError) {
    return res.status(userId.statusCode).json(createResponse({ error: userId }));
  }
  const user = await usersService.deleteUser(userId);
  if (user === null) {
    return res.status(404).json(createResponse({ error: new DoesNotExistError('Item does not exist') }));
  }
  res.json(createResponse({ data: user }));
};

// const makeAdmin: Handler = async (req, res, next) => {
//   // async makeAdmin(id: number) {
//   return { user: await usersService.deleteUser(id) };
// };

const updateUser: Handler = async (req, res, next) => {
  // see if user exists before attempting update
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
    if (user === null) {
      return res.status(404).json(createResponse({ error: new DoesNotExistError('User does not exist') }));
    }
    res.json(createResponse({ data: user }));
  } catch (e) {
    next(e);
  }
  // const user = await usersService.getUser(id);
  // if (user === null) {
  //   return { user };
  // }
  // return { user: await usersService.updateUser(id, userChange) };
};
// }

const getAllUsers: Handler = async (req, res, next) => {
  try {
    res.json(createResponse({ data: { users: await usersService.getAllUsers() } }));
  } catch (e) {
    next(e);
  }
};

/**
 * Validates that the user id is a valid format.
 * Performs more robust checks and is quicker and less repetitive than a manual implementation.
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
