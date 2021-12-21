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
import { testingAPI } from '@/testing';
import error from '@/error/index';
import { devAPI } from '@/dev';

/** Loads all the routes that will be used in the app. */
export function loadRoutes() {
  const router = Router();

  // combine all route handlers into this single route handler
  router.use('/auth', protectedAPI);
  router.use('/auth/login', loginAPI);
  router.use('/auth/token', refreshTokenAPI);
  router.use('/consumables', consumablesAPI);
  router.use('/auth/register', registerAPI);
  router.use('/serializables', serializablesAPI);
  router.use('/transactions', transactionsAPI);
  router.use('/users', usersAPI);

  // request handlers that are used during development phase
  if (process.env.NODE_ENV !== 'production') {
    router.use(devAPI);
    router.use('/error', error);
    router.use('/testing', testingAPI);
  }
  return router;
}
