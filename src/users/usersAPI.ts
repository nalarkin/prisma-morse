import { Router } from 'express';
import passport from 'passport';
import { usersController } from './usersController';

const route = Router();

export function usersAPI(app: Router) {
  app.use('/users', route);

  /** Get all users */
  route.get('/', usersController.getAllUsers);

  /** Delete specified user */
  route.delete('/:id/', usersController.deleteUser);

  /** Get the current user info, including the serializables they currently have checked out. */
  route.get('/:id/', usersController.getUser);

  /** Gives admins the power to update other users */
  route.put('/:id/', passport.authenticate('jwt', { session: false }), usersController.updateUser);
}
