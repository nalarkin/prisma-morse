import { Router } from 'express';
import passport from 'passport';
import { createResponse } from '../common/response';
import { UsersController } from './usersController';
import { JWTPayloadRequest } from '../config/passport';
import { ajv } from '../common/validation';
import { UserEdit, UserId } from '../common/schema/schema_user';

const route = Router();

export function usersAPI(app: Router) {
  app.use('/users', route);

  /** Get all users */
  route.get('/', async (req, res) => {
    const { users } = await new UsersController().getAllUsers();
    res.json(createResponse({ data: users }));
  });

  /** Delete specified user */
  route.delete('/:id/', async (req, res) => {
    const { id } = req.params;
    const userId = getUserId(id);
    if (userId === null) {
      // if id in url was invalid
      return res.status(404).json(createResponse({ error: 'Invalid user id format.', status: 404 }));
    }
    const { user } = await new UsersController().deleteUser(userId);
    if (user === null) {
      return res.status(404).json(createResponse({ error: 'This user does not exist', status: 404 }));
    }
    res.json(createResponse({ data: user }));
  });

  /** Get the current user info, including the serializables they currently have checked out. */
  route.get('/:id/', async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = getUserId(id);
      if (userId === null) {
        // if id in url was invalid
        return res.status(404).json(createResponse({ error: 'Invalid user id format.', status: 404 }));
      }
      const { user } = await new UsersController().getUser(userId);
      if (user === null) {
        return res.status(404).json(createResponse({ error: 'This user does not exist', status: 404 }));
      }
      res.json(createResponse({ data: user }));
    } catch (e) {
      next(e);
    }
  });

  /** Gives admins the power to update other users */
  route.put('/:id/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      const { id } = req.params;
      const { role } = req.user as JWTPayloadRequest;
      if (role !== 'ADMIN') {
        return res.status(401).json(createResponse({ error: 'Only admins can change a users role', status: 401 }));
      }
      const userId = getUserId(id);
      if (userId === null) {
        // if id in url was invalid
        return res.status(404).json(createResponse({ error: 'Invalid user id format.', status: 404 }));
      }
      const validator = ajv.getSchema<UserEdit>('user');
      if (validator === undefined) {
        throw new Error('Could not find JSON validator');
      }
      const { body } = req;
      if (!validator(body)) {
        // if data in request body is invalid
        return res.status(401).json(createResponse({ error: ajv.errorsText(validator.errors), status: 401 }));
      }

      const { user } = await new UsersController().updateUser(userId, body);
      if (user === null) {
        return res.status(404).json(createResponse({ error: 'User does not exist', status: 404 }));
      }
      res.json(createResponse({ data: user }));
    } catch (e) {
      next(e);
    }
  });
  /** Gives admins the power to make other users admins */
  route.get('/:id/verify/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = getUserId(id);
      if (userId !== null) {
        return res.send('Validated!');
      }
      return res.send('Denied');
    } catch (e) {
      next(e);
    }
  });
}

/**
 * Validates that the user id is a valid format.
 * Performs more robust checks and is quicker and less repetitive.
 */
function getUserId(id: string) {
  const userId = Number(id);
  const validateId = ajv.getSchema<UserId>('userId');
  if (validateId === undefined) {
    throw new Error('Could not find JSON validator');
  }
  if (validateId({ id: userId })) {
    return userId;
  }
  return null;
}
