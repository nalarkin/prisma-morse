import { Router } from 'express';
import passport from 'passport';
import * as usersController from './usersController';
import { getRequireAdminMiddleware } from '@/common';

const route = Router();

export function usersAPI(app: Router) {
  app.use('/users', route);

  /** Get all users */
  route.get('/', usersController.getAllUsers);

  /** Delete specified user */
  route.delete('/:id/', usersController.validateUserID, usersController.deleteUser);

  /** Get the current user info, including the serializables they currently have checked out. */
  route.get('/:id/', usersController.validateUserID, usersController.getUser);

  /** Gives admins the power to update other users */
  route.put(
    '/:id/',
    passport.authenticate('jwt', { session: false }),
    getRequireAdminMiddleware('You must be an admin to edit other users.'),
    usersController.validateUserID,
    usersController.updateUser,
  );
}
