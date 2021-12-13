import { Router } from 'express';
import passport from 'passport';
import * as usersController from './usersController';
import { getRequireAdminMiddleware } from '@/common';

const route = Router();

export function usersAPI(app: Router) {
  app.use('/users', route);

  /** Get all users */
  route.get('/', usersController.getAllUsers);

  /** This middleware gets used on all routes that match this form */
  route.use('/:id/', usersController.validateUserIDParam);

  /** Delete specified user */
  route.delete('/:id/', usersController.deleteUser);

  /** Get the current user info, including the serializables they currently have checked out. */
  route.get('/:id/', usersController.getUser);

  /** Gives admins the power to update other users */
  route.put(
    '/:id/',
    passport.authenticate('jwt', { session: false }),
    getRequireAdminMiddleware('You must be an admin to edit other users.'),
    usersController.updateUser,
  );
}
