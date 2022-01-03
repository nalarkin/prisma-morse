import { Router } from 'express';
import passport from 'passport';
import { getRequireAdminMiddleware } from '../common';
import * as usersController from './usersController';

const router = Router();

/** Get all users, currently doesn't require requester to be authenticated */
router.get('/', usersController.getAllUsers);

/** Get the current user info using the validated JWT to perform a lookup*/
router.get('/profile/', passport.authenticate('jwt', { session: false }), usersController.getCurrentUser);

/** Delete specified user */
router.delete(
  '/:id/',
  passport.authenticate('jwt', { session: false }),
  getRequireAdminMiddleware('You must be an admin to delete other users.'),
  usersController.deleteUser,
);

/** Get the specified user info, including the serializables they currently have checked out. */
router.get('/:id/', usersController.getUser);

/** Gives admins the power to update other users */
router.put(
  '/:id/',
  passport.authenticate('jwt', { session: false }),
  getRequireAdminMiddleware('You must be an admin to edit other users.'),
  usersController.updateUser,
);

export default router;
