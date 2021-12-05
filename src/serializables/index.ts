import { Transaction, User } from '@prisma/client';
import express from 'express';
import passport from 'passport';
import { createResponse } from '../common/response';
import prisma from '../config/database';

const router = express.Router();

/** Get all serializables if user is authenticated */
router.get('/serializables', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const serializables = await prisma.serializable.findMany();
  res.json(createResponse({ data: serializables }));
});

/** Delete serializable if user is Admin */
router.delete('/serializable/:id/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user as User;
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
    log.error(err);
  }
});

router.get('/serializable/:id/', async (req, res) => {
  try {
    const { id } = req.params;
    const serializable = await prisma.serializable.findUnique({
      where: {
        id: id,
      },
      include: {
        User: true,
      },
    });
    if (serializable === null) {
      return res.status(404).json(createResponse({ error: 'Serializable item does not exist' }));
    }
    res.json(createResponse({ data: serializable }));
  } catch (err) {
    log.error(err);
    res.status(401).json({ error: `Unknown error occured. ${JSON.stringify(err)}` });
  }
});

/** Checkout Item */
router.put('/serializable/:id/checkout/auth/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user as User;
    // find serializable and checkout
    const checkoutSerializable = prisma.serializable.update({
      where: {
        id,
      },
      data: {
        userId,
      },
    });
    // update user connection with item
    const addToUserSerializables = prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        Serializable: { connect: { id: id } },
      },
    });
    const checkoutTransaction = createTransaction(id, userId, 'CHECKOUT');
    const [checkoutResult, addResult, transactionResult] = await prisma.$transaction([
      checkoutSerializable,
      addToUserSerializables,
      checkoutTransaction,
    ]);
    res.json(createResponse({ data: { checkoutResult, addResult, transactionResult } }));
  } catch (err) {
    log.error(err);
    res.json(createResponse({ error: 'Error occured during checkout process' }));
  }
});

router.put('/serializable/:id/checkout/', async (req, res) => {
  const { id } = req.params;
  /** Insert logic to check if request id requesting change is the same as the current renter */
  const serializable = await prisma.serializable.update({
    where: {
      id: id,
    },
    data: {
      userId: 4,
    },
  });
  res.json(createResponse({ data: serializable }));
});
router.put('/serializable/:id/return/', async (req, res) => {
  const { id } = req.params;
  /** Insert logic to check if request id requesting change is the same as the current renter */
  const serializable = await prisma.serializable.update({
    where: {
      id: id,
    },
    data: {
      userId: null,
    },
  });
  res.json(createResponse({ data: serializable }));
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
