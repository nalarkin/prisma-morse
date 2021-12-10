import { Router } from 'express';
import passport from 'passport';
import { JWTData } from '../auth/utils';
import { createResponse } from '../common/response';
import prisma from '../config/database';
import { SerializablesController } from './serializablesController';

const route = Router();

export function serializablesAPI(app: Router) {
  app.use('/serializables', route);

  /** Get all serializables if user is authenticated */
  route.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { serializables } = await new SerializablesController().getAll();
    res.json(createResponse({ data: serializables }));
  });

  /** Delete serializable if user is Admin */
  route.delete('/:id/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      const { id } = req.params;
      const { role } = req.user as JWTData;
      if (role !== 'ADMIN') {
        return res
          .status(401)
          .json(createResponse({ error: 'You are not authorized to delete serializable items', status: 401 }));
      }

      const serializable = await prisma.serializable.delete({
        where: {
          id: id,
        },
      });
      res.json(createResponse({ data: serializable }));
    } catch (err) {
      next(err);
    }
  });

  /** Get specific serializable */
  route.get('/:id/', async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await new SerializablesController().getSingle(id);

      res.status(response.status).json(response);
    } catch (err) {
      next(err);
    }
  });

  /**
   * Checkout Serializable
   * Solve issue of double checking by using the following recommendation
   *  https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#optimistic-concurrency-control
   * */
  route.put('/:id/checkout/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      const { id } = req.params;
      const { sub: userId } = req.user as JWTData;
      // find serializable
      const { status, ...response } = await new SerializablesController().checkout(id, userId);
      res.status(status).json(response);
    } catch (err) {
      next(err);
    }
  });

  /** Return an item, only if the person returning matches the current renter */
  route.put('/:id/return/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      const { id } = req.params;
      const { sub: userId } = req.user as JWTData;
      /** Insert logic to check if request id requesting change is the same as the current renter */
      const { status, ...response } = await new SerializablesController().returnItem(id, userId);
      res.status(status).json(response);
    } catch (err) {
      next(err);
    }
  });
}
