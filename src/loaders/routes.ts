/**
 * This file loads gathers all routes that will be used in the server.
 *
 * If you want to add a new route handler, then you should create it's
 * respective folder and import the respected router/function from that
 * folder inside this folder. Then the server will handle those respective route(s).
 */

import { Router } from 'express';
import { loginAPI, protectedAPI, refreshAPI, registerAPI } from '../auth';
import { resetAPI } from '../auth/reset';
import cookieAPI from '../auth/token/cookie';
import { consumablesAPI } from '../consumables';
import { devAPI } from '../dev';
import { docsAPI } from '../docs';
import error from '../error/index';
import { serializablesAPI } from '../serializables';
import { testingAPI } from '../testing';
import { transactionsAPI } from '../transactions';
import { usersAPI } from '../users';

/** Loads all the routes that will be used in the app. */
export function loadRoutes() {
  const router = Router();

  // combine all route handlers into this single route handler
  router.use('/auth', protectedAPI);
  router.use('/auth/login', loginAPI);
  router.use('/auth/token', refreshAPI);
  router.use('/consumables', consumablesAPI);
  router.use('/auth/register', registerAPI);
  router.use('/auth/reset', resetAPI);
  router.use('/serializables', serializablesAPI);
  router.use('/transactions', transactionsAPI);
  router.use('/users', usersAPI);
  router.use('/cookies', cookieAPI);
  router.use('/docs', docsAPI);

  // request handlers that are used during development phase
  if (process.env.NODE_ENV !== 'production') {
    router.use(devAPI);
    router.use('/error', error);
    router.use('/testing', testingAPI);
    router.use('/docs', docsAPI);
  }
  return router;
}
