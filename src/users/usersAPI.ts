import { Router } from 'express';
import passport from 'passport';
import * as usersController from './usersController';
import { getRequireAdminMiddleware } from '../common';

const router = Router();

/** Get all users */
router.get('/', usersController.getAllUsers);

/** Get the current user info using the validated JWT to perform a lookup*/
router.get('/profile/', passport.authenticate('jwt', { session: false }), usersController.getCurrentUser);

// /** This middleware gets used on all routes that match this form */
// router.use('/:id/', usersController.validateUserIDParam);

/** Delete specified user */
router.delete('/:id/', usersController.deleteUser);

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
