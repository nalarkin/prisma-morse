import { Router } from 'express';
import { serializablesAPI } from '@/serializables';
import { usersAPI } from '@/users';
import { refreshTokenAPI, loginAPI, protectedAPI, registerAPI } from '@/auth';
import { consumablesAPI } from '@/consumables';
import { transactionsAPI } from '@/transactions';
import error from '@/error/index';

/** Loads all the routes that will be used in the app. */
export function loadRoutes() {
  const router = Router();
  // one way of adding routes to app
  usersAPI(router);
  serializablesAPI(router);

  // alternative way where we prefix the pages within this file
  router.use('/auth', protectedAPI);
  router.use('/auth/login', loginAPI);
  router.use('/auth/register', registerAPI);
  router.use('/auth/token', refreshTokenAPI);
  router.use('/consumables', consumablesAPI);
  router.use('/transactions', transactionsAPI);
  router.use('/error', error);
  return router;
}
