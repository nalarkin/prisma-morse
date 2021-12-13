import { getRequireAdminMiddleware, verifyCUIDMiddleware } from '@/common';
import { Router } from 'express';
import passport from 'passport';
import * as serializablesController from './serializablesController';

const route = Router();

export function serializablesAPI(app: Router) {
  app.use('/serializables', route);
  /** Used to test id verification middleware */
  route.get('/verify/:id/', verifyCUIDMiddleware);

  /** Require every route here to be from authenticated source */
  route.use('/', passport.authenticate('jwt', { session: false }));

  /** Get all serializables if user is authenticated */
  route.get('/', serializablesController.getAll);

  /** Use item id verification for every request that provides an id param */
  route.use('/:id/', verifyCUIDMiddleware);

  /** Delete serializable if user is Admin */
  route.delete('/:id/', getRequireAdminMiddleware(), serializablesController.deleteItem);

  /** Get specific serializable */
  route.get('/:id/', serializablesController.getSingle);

  /**
   * Checkout Serializable
   * Solve issue of double checking by using the following recommendation
   *  https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#optimistic-concurrency-control
   * */
  route.put('/:id/checkout/', serializablesController.checkout);

  /** Return an item, only if the person returning matches the current renter */
  route.put('/:id/return/', serializablesController.returnItem);
}
