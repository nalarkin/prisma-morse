import { Transaction, User } from '@prisma/client';
import express from 'express';
import passport from 'passport';
import { JWTData } from '../auth/utils';
import { createResponse } from '../common/response';
import prisma from '../config/database';
import { logger } from '../config/logging';

const router = express.Router();

/** Get all serializables if user is authenticated */
router.get('/serializables', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const serializables = await prisma.serializable.findMany();
  res.json(createResponse({ data: serializables }));
});

/** Delete serializable if user is Admin */
router.delete('/serializable/:id/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user as JWTData;
    if (role !== 'ADMIN') {
      return res.status(401).json(createResponse({ error: 'You are not authorized to delete serializable items' }));
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

router.get('/serializable/:id/', async (req, res, next) => {
  try {
    const { id } = req.params;
    const serializable = await prisma.serializable.findUnique({
      where: {
        id: id,
      },
      include: {
        renter: true,
      },
    });
    if (serializable === null) {
      return res.status(404).json(createResponse({ error: 'Serializable item does not exist' }));
    }
    res.json(createResponse({ data: serializable }));
  } catch (err) {
    next(err);
  }
});

/**
 * Checkout Item
 * @TODO: Add validation for making sure item is available before checking it out. Currently people can
 * checkout item that is already checked out.
 * See below for example of a way to solve it:
 *  https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#optimistic-concurrency-control
 * */
router.put('/serializable/:id/checkout/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sub: userId } = req.user as JWTData;
    // find serializable and checkout
    const checkoutSerializable = await prisma.serializable.findUnique({
      where: {
        id,
      },
    });
    if (checkoutSerializable === null) {
      return res.status(404).json(createResponse({ error: 'Serializable does not exist' }));
    }

    if (checkoutSerializable.userId === userId) {
      return res.status(400).json(createResponse({ error: 'You are already renting this item' }));
    }
    // if no current user is renting it
    if (checkoutSerializable.userId === null) {
      const updateSerializable = prisma.serializable.update({
        where: {
          id,
        },
        data: {
          userId,
        },
      });
      const addToUserSerializables = prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          serializables: { connect: { id: id } },
        },
      });
      const checkoutTransaction = createTransaction(id, userId, 'CHECKOUT');
      const [updateResult, addResult, transactionResult] = await prisma.$transaction([
        updateSerializable,
        addToUserSerializables,
        checkoutTransaction,
      ]);
      res.json(createResponse({ data: { updateResult, addResult, transactionResult } }));
    } else {
      return res
        .status(400)
        .json(createResponse({ error: 'You cannot checkout an item that is already checked out by another user' }));
    }
  } catch (err) {
    next(err);
  }
});

/** Return an item, only if the person returning matches the current renter */
router.put('/serializable/:id/return/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { id } = req.params;
  const { sub: userId } = req.user as JWTData;
  /** Insert logic to check if request id requesting change is the same as the current renter */
  const serializable = await prisma.serializable.findUnique({
    where: {
      id,
    },
  });
  if (serializable === null) {
    return res.status(404).json(createResponse({ error: 'Item does not exist' }));
  }
  if (serializable.userId === null) {
    return res.status(400).json(createResponse({ error: 'You cannot return an item that is not being rented' }));
  }
  if (serializable.userId !== userId) {
    return res.status(401).json(createResponse({ error: 'You cannot return an item that someone else is renting' }));
  }
  const result = await prisma.serializable.update({
    where: {
      id,
    },
    data: {
      userId: null,
    },
  });
  res.json(createResponse({ data: result }));
});

/** Helper function to create a transaction */
function createTransaction(serializableId: string, userId: number, type: Transaction['type']) {
  return prisma.transaction.create({
    data: {
      serializableId,
      userId,
      type,
    },
  });
}

export default router;
