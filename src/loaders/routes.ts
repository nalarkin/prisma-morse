/**
 * This file loads gathers all routes that will be used in the server.
 *
 * If you want to add a new route handler, then you should create it's
 * respective folder and import the respected router/function from that
 * folder inside this folder. Then the server will handle those respective route(s).
 */

import { Router } from 'express';
import { serializablesAPI } from '@/serializables';
import { usersAPI } from '@/users';
import { refreshTokenAPI, loginAPI, protectedAPI, registerAPI } from '@/auth';
import { consumablesAPI } from '@/consumables';
import { transactionsAPI } from '@/transactions';
import error from '@/error/index';
import { devAPI } from '@/dev';

/** Loads all the routes that will be used in the app. */
export function loadRoutes() {
  const router = Router();
  // one way of adding routes to app
  usersAPI(router);
  serializablesAPI(router);
  registerAPI(router);

  // alternative way where we prefix the pages within this file
  router.use('/auth', protectedAPI);
  router.use('/auth/login', loginAPI);
  router.use('/auth/token', refreshTokenAPI);
  router.use('/consumables', consumablesAPI);
  router.use('/transactions', transactionsAPI);
  router.use('/error', error);
  if (process.env.NODE_ENV !== 'production') {
    // only used for convenience to list urls at base url
    devAPI(router);
  }
  return router;
}
