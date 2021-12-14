import { Router } from 'express';
import * as registerController from './registerController';

const route = Router();

export function registerAPI(app: Router) {
  app.use('/auth/register', route);

  /** Register a user */
  route.post('/', registerController.validateRegistrationForm, registerController.registerUser);
}
