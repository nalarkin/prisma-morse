import { Router } from 'express';
import passport from 'passport';
import { serializablesController } from './serializablesController';

const route = Router();

export function serializablesAPI(app: Router) {
  app.use('/serializables', route);

  /** Get all serializables if user is authenticated */
  route.get('/', passport.authenticate('jwt', { session: false }), serializablesController.getAll);

  /** Delete serializable if user is Admin */
  route.delete('/:id/', passport.authenticate('jwt', { session: false }), serializablesController.deleteItem);

  /** Get specific serializable */
  route.get('/:id/', serializablesController.getSingle);

  /**
   * Checkout Serializable
   * Solve issue of double checking by using the following recommendation
   *  https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#optimistic-concurrency-control
   * */
  route.put('/:id/checkout/', passport.authenticate('jwt', { session: false }), serializablesController.checkout);

  /** Return an item, only if the person returning matches the current renter */
  route.put('/:id/return/', passport.authenticate('jwt', { session: false }), serializablesController.returnItem);
}
