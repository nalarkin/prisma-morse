import { Router } from 'express';
import { createResponse } from '../common/response';
import { UsersController } from './usersController';

const route = Router();

export function usersAPI(app: Router) {
  app.use('/users', route);

  /** Get all users */
  route.get('/', async (req, res) => {
    const { users } = await new UsersController({}).getAllUsers();
    res.json(createResponse({ data: users }));
  });

  /** Delete specified user */
  route.delete('/:id/', async (req, res) => {
    const { id } = req.params;
    const { user } = await new UsersController({ id }).deleteUser();
    if (user === null) {
      return res.status(404).json(createResponse({ error: 'This user does not exist', status: 404 }));
    }
    res.json(createResponse({ data: user }));
  });

  /** Get the current user info, including the serializables they currently have checked out. */
  route.get('/:id/', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { user } = await new UsersController({ id }).getUser();
      if (user === null) {
        return res.status(404).json(createResponse({ error: 'This user does not exist', status: 404 }));
      }
      res.json(createResponse({ data: user }));
    } catch (e) {
      next(e);
    }
  });
}
